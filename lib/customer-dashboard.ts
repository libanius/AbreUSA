import "server-only";

import { getSupabaseServerClient } from "@/lib/supabase-server";

const SERVICE_LABELS: Record<string, string> = {
  complete_llc_ein: "Pacote completo: LLC + EIN",
  florida_llc: "Abertura de LLC na Florida",
};

const STATUS_LABELS: Record<string, string> = {
  draft: "Rascunho",
  awaiting_documents: "Aguardando documentos",
  ready_for_review: "Pronto para revisao",
  customer_reviewing: "Em revisao pelo cliente",
  approved: "Aprovado pelo cliente",
  internal_review: "Em revisao interna",
  submitted: "Enviado para processamento",
  completed: "Concluido",
  blocked: "Pendente",
};

const DOCUMENT_LABELS: Record<string, string> = {
  passport: "Passaporte",
  us_address_proof: "Comprovante de endereco nos EUA",
};

const FORM_LABELS: Record<string, string> = {
  florida_articles_of_organization: "Florida Articles of Organization",
  irs_ss4: "Solicitacao de EIN (IRS SS-4)",
  irs_ein_application: "Solicitacao de EIN",
};

type EmbeddedRow = Record<string, unknown>;

export type CustomerDashboardOrder = {
  protocolNumber: string;
  serviceLabel: string;
  status: string;
  statusLabel: string;
  onboardingEntryLabel: string;
  documentExtractionLabel: string;
  extractionConfidence: number | null;
  createdAt: string;
  approvedAt: string | null;
  applicantName: string;
  applicantEmail: string;
  llcName: string;
  llcState: string;
  documents: Array<{
    type: string;
    label: string;
    statusLabel: string;
    retentionLabel: string;
  }>;
  generatedForms: Array<{
    type: string;
    label: string;
    customerApproved: boolean;
  }>;
  timeline: Array<{
    label: string;
    state: "done" | "current" | "next";
  }>;
};

function normalizeProtocol(protocol: string) {
  return protocol.trim().toUpperCase();
}

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function firstEmbedded(value: unknown): EmbeddedRow | null {
  return Array.isArray(value) ? ((value[0] as EmbeddedRow | undefined) ?? null) : null;
}

function embeddedList(value: unknown): EmbeddedRow[] {
  return Array.isArray(value) ? (value as EmbeddedRow[]) : [];
}

function text(value: unknown, fallback = "") {
  return typeof value === "string" && value.trim() ? value : fallback;
}

function tokenLabel(value: unknown, fallback: string) {
  return text(value, fallback).replace(/_/g, " ");
}

function buildTimeline(status: string): CustomerDashboardOrder["timeline"] {
  const steps = [
    { key: "approved", label: "Pedido recebido pela AbreUSA" },
    { key: "internal_review", label: "Revisao interna dos dados" },
    { key: "submitted", label: "Preparacao e envio dos proximos passos" },
    { key: "completed", label: "Processo concluido" },
  ];
  const order = steps.findIndex((step) => step.key === status);
  const activeIndex = order === -1 ? 1 : order;

  return steps.map((step, index) => ({
    label: step.label,
    state:
      index < activeIndex
        ? "done"
        : index === activeIndex
          ? "current"
          : "next",
  }));
}

export async function getCustomerDashboardOrder({
  protocol,
  email,
}: {
  protocol: string;
  email: string;
}): Promise<CustomerDashboardOrder | null> {
  const protocolNumber = normalizeProtocol(protocol);
  const applicantEmail = normalizeEmail(email);

  if (!protocolNumber || !applicantEmail) {
    return null;
  }

  const supabase = getSupabaseServerClient();
  const { data, error } = await (supabase as ReturnType<typeof getSupabaseServerClient>)
    .from("orders")
    .select(`
      id, protocol_number, service_type, status, approved_at, created_at,
      onboarding_entry_mode, document_extraction_status, extraction_confidence,
      applicants(name, email),
      llcs(legal_name, state),
      documents(document_type, retention_status, deletion_status),
      generated_forms(form_type, customer_approved)
    `)
    .eq("protocol_number", protocolNumber)
    .maybeSingle();

  if (error) {
    throw new Error(`Failed to load customer dashboard order: ${error.message}`);
  }

  if (!data) {
    return null;
  }

  const order = data as unknown as EmbeddedRow;
  const applicant = firstEmbedded(order.applicants);
  const llc = firstEmbedded(order.llcs);
  const storedApplicantEmail = normalizeEmail(text(applicant?.email));

  if (!storedApplicantEmail || storedApplicantEmail !== applicantEmail) {
    return null;
  }

  const status = text(order.status, "internal_review");
  const documents = embeddedList(order.documents).map((doc) => {
    const documentType = text(doc.document_type, "document");
    const deleted = doc.deletion_status === "success" || doc.retention_status === "deleted";

    return {
      type: documentType,
      label: DOCUMENT_LABELS[documentType] ?? tokenLabel(documentType, "Documento"),
      statusLabel: deleted ? "Removido conforme politica de retencao" : "Recebido com seguranca",
      retentionLabel: deleted ? "Arquivo apagado" : "Arquivo privado",
    };
  });

  const generatedForms = embeddedList(order.generated_forms).map((form) => {
    const formType = text(form.form_type, "form");
    return {
      type: formType,
      label: FORM_LABELS[formType] ?? tokenLabel(formType, "Formulario"),
      customerApproved: Boolean(form.customer_approved),
    };
  });

  return {
    protocolNumber: text(order.protocol_number, protocolNumber),
    serviceLabel: SERVICE_LABELS[text(order.service_type)] ?? tokenLabel(order.service_type, "Servico"),
    status,
    statusLabel: STATUS_LABELS[status] ?? tokenLabel(status, "Em acompanhamento"),
    onboardingEntryLabel:
      order.onboarding_entry_mode === "document_assisted"
        ? "Com documentos enviados no inicio"
        : "Preenchimento manual guiado",
    documentExtractionLabel:
      order.document_extraction_status === "completed"
        ? "Dados extraidos e revisados"
        : tokenLabel(order.document_extraction_status, "Nao iniciado"),
    extractionConfidence:
      typeof order.extraction_confidence === "number" ? order.extraction_confidence : null,
    createdAt: text(order.created_at),
    approvedAt: text(order.approved_at) || null,
    applicantName: text(applicant?.name, "Cliente AbreUSA"),
    applicantEmail: storedApplicantEmail,
    llcName: text(llc?.legal_name, "LLC em preparacao"),
    llcState: text(llc?.state, "Florida"),
    documents,
    generatedForms,
    timeline: buildTimeline(status),
  };
}

export async function getCustomerDashboardOrdersByEmail(
  email: string,
): Promise<CustomerDashboardOrder[]> {
  const normalizedEmail = normalizeEmail(email);
  if (!normalizedEmail) return [];

  const supabase = getSupabaseServerClient();

  // Find order IDs where applicant email matches
  const { data: applicantRows, error: applicantError } = await supabase
    .from("applicants")
    .select("order_id")
    .eq("email", normalizedEmail);

  if (applicantError) {
    throw new Error(`Failed to load applicant records: ${applicantError.message}`);
  }

  const orderIds = (applicantRows ?? []).map((r: { order_id: unknown }) => r.order_id as string);
  if (orderIds.length === 0) return [];

  const { data, error } = await (supabase as ReturnType<typeof getSupabaseServerClient>)
    .from("orders")
    .select(`
      id, protocol_number, service_type, status, approved_at, created_at,
      onboarding_entry_mode, document_extraction_status, extraction_confidence,
      applicants(name, email),
      llcs(legal_name, state),
      documents(document_type, retention_status, deletion_status),
      generated_forms(form_type, customer_approved)
    `)
    .in("id", orderIds)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(`Failed to load customer dashboard orders: ${error.message}`);
  }

  return (data ?? []).map((row) => {
    const order = row as unknown as EmbeddedRow;
    const applicant = firstEmbedded(order.applicants);
    const llc = firstEmbedded(order.llcs);
    const status = text(order.status, "internal_review");

    const documents = embeddedList(order.documents).map((doc) => {
      const documentType = text(doc.document_type, "document");
      const deleted = doc.deletion_status === "success" || doc.retention_status === "deleted";
      return {
        type: documentType,
        label: DOCUMENT_LABELS[documentType] ?? tokenLabel(documentType, "Documento"),
        statusLabel: deleted ? "Removido conforme politica de retencao" : "Recebido com seguranca",
        retentionLabel: deleted ? "Arquivo apagado" : "Arquivo privado",
      };
    });

    const generatedForms = embeddedList(order.generated_forms).map((form) => {
      const formType = text(form.form_type, "form");
      return {
        type: formType,
        label: FORM_LABELS[formType] ?? tokenLabel(formType, "Formulario"),
        customerApproved: Boolean(form.customer_approved),
      };
    });

    return {
      protocolNumber: text(order.protocol_number),
      serviceLabel: SERVICE_LABELS[text(order.service_type)] ?? tokenLabel(order.service_type, "Servico"),
      status,
      statusLabel: STATUS_LABELS[status] ?? tokenLabel(status, "Em acompanhamento"),
      onboardingEntryLabel:
        order.onboarding_entry_mode === "document_assisted"
          ? "Com documentos enviados no inicio"
          : "Preenchimento manual guiado",
      documentExtractionLabel:
        order.document_extraction_status === "completed"
          ? "Dados extraidos e revisados"
          : tokenLabel(order.document_extraction_status, "Nao iniciado"),
      extractionConfidence:
        typeof order.extraction_confidence === "number" ? order.extraction_confidence : null,
      createdAt: text(order.created_at),
      approvedAt: text(order.approved_at) || null,
      applicantName: text(applicant?.name, "Cliente AbreUSA"),
      applicantEmail: text(applicant?.email, normalizedEmail),
      llcName: text(llc?.legal_name, "LLC em preparacao"),
      llcState: text(llc?.state, "Florida"),
      documents,
      generatedForms,
      timeline: buildTimeline(status),
    } satisfies CustomerDashboardOrder;
  });
}

