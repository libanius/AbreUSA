import { notFound } from "next/navigation";
import Link from "next/link";
import { getSupabaseServerClient } from "@/lib/supabase-server";
import StatusUpdater from "./_components/status-updater";
import DeleteDocumentButton from "./_components/delete-document-button";

export const dynamic = "force-dynamic";

const SERVICE_LABELS: Record<string, string> = {
  complete_llc_ein: "Complete Package (LLC + EIN)",
  florida_llc: "Florida LLC Formation",
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h2 className="text-base font-bold text-gray-900 mb-4">{title}</h2>
      {children}
    </div>
  );
}

function Field({ label, value }: { label: string; value: string | number | null | undefined }) {
  return (
    <div>
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{label}</p>
      <p className="text-sm text-gray-900 mt-0.5">{value ?? "—"}</p>
    </div>
  );
}

function RetentionBadge({ status }: { status: string | null | undefined }) {
  const color =
    status === "deleted"
      ? "bg-gray-200 text-gray-700"
      : status === "eligible_for_deletion" || status === "deletion_pending"
        ? "bg-yellow-100 text-yellow-800"
        : status === "retained_by_exception"
          ? "bg-purple-100 text-purple-800"
          : "bg-green-100 text-green-800";

  return (
    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${color}`}>
      {(status ?? "active").replace(/_/g, " ")}
    </span>
  );
}

function formatToken(value: unknown, fallback: string) {
  return String(value ?? fallback).replace(/_/g, " ");
}

export default async function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = getSupabaseServerClient();

  // Fetch all order data in one query using resource embedding
  const { data, error } = await (supabase as ReturnType<typeof getSupabaseServerClient>)
    .from("orders")
    .select(`
      id, protocol_number, service_type, status, approved_at, created_at,
      onboarding_entry_mode, document_extraction_status, extraction_confidence,
      user_confirmed_extracted_data, agent_summary, missing_information_flags, correction_notes,
      applicants(id, name, email, phone, residential_street, residential_city, residential_state, residential_zip),
      llcs(id, legal_name, state, business_activity_label, principal_street, principal_city, principal_state, principal_zip, principal_same_as_applicant_address, management_type, member_count),
      members(id, member_index, full_name, address, ownership_percentage),
      registered_agents(id, choice, name, address, city, state, zip),
      ein_details(id, reason_for_applying, entity_type, responsible_party_name, responsible_party_passport_number, start_date, fiscal_closing_month),
      generated_forms(id, form_type, customer_approved),
      documents(id, document_type, file_name, mime_type, storage_path, retention_category, retention_eligible_at, retention_status, deletion_status, deleted_at)
    `)
    .eq("id", id)
    .single();

  if (error || !data) {
    notFound();
  }

  const order = data as unknown as Record<string, unknown>;
  const applicant = ((order.applicants as Record<string, unknown>[])?.[0]) ?? null;
  const llc = ((order.llcs as Record<string, unknown>[])?.[0]) ?? null;
  const members = ((order.members as Record<string, unknown>[]) ?? []).sort(
    (a, b) => (a.member_index as number) - (b.member_index as number),
  );
  const registeredAgent = ((order.registered_agents as Record<string, unknown>[])?.[0]) ?? null;
  const einDetails = ((order.ein_details as Record<string, unknown>[])?.[0]) ?? null;
  const generatedForms = (order.generated_forms as Record<string, unknown>[]) ?? [];
  const documents = (order.documents as Record<string, unknown>[]) ?? [];
  const applicantResidentialAddress = applicant?.residential_street
    ? `${applicant.residential_street as string}, ${applicant.residential_city as string}, ${applicant.residential_state as string} ${applicant.residential_zip as string}`
    : "—";
  const llcPrincipalAddress = llc
    ? `${llc.principal_street as string}, ${llc.principal_city as string}, ${llc.principal_state as string} ${llc.principal_zip as string}`
    : "—";

  // Generate signed URLs for each document (60 min expiry)
  type DocWithUrls = Record<string, unknown> & { viewUrl: string | null; downloadUrl: string | null };
  const docsWithUrls: DocWithUrls[] = await Promise.all(
    documents.map(async (doc): Promise<DocWithUrls> => {
      const storagePath = doc.storage_path as string;
      const fileName = doc.file_name as string;
      const { data: viewData } = await supabase.storage
        .from("documents")
        .createSignedUrl(storagePath, 3600);
      const { data: downloadData } = await supabase.storage
        .from("documents")
        .createSignedUrl(storagePath, 3600, { download: fileName });
      return {
        ...doc,
        viewUrl: viewData?.signedUrl ?? null,
        downloadUrl: downloadData?.signedUrl ?? null,
      };
    }),
  );

  return (
    <div className="space-y-6">
      {/* Back */}
      <Link href="/admin/orders" className="text-sm text-green-700 hover:underline">
        ← Back to orders
      </Link>

      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <p className="text-xs font-bold tracking-widest text-green-700 uppercase mb-1">
            {SERVICE_LABELS[order.service_type as string] ?? (order.service_type as string)}
          </p>
          <h1 className="text-2xl font-bold text-gray-900 font-mono">
            {order.protocol_number as string}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Submitted {new Date(order.created_at as string).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
          </p>
        </div>
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Status</p>
          <StatusUpdater orderId={id} currentStatus={order.status as string} currentCorrectionNotes={typeof order.correction_notes === "string" ? order.correction_notes : null} />
        </div>
      </div>

      <Section title="Onboarding Foundation">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Field
            label="Entry Mode"
            value={formatToken(order.onboarding_entry_mode, "manual")}
          />
          <Field
            label="Document Extraction Status"
            value={formatToken(order.document_extraction_status, "not_started")}
          />
          <Field
            label="User Confirmed Extracted Data"
            value={order.user_confirmed_extracted_data ? "Yes" : "No"}
          />
          <Field
            label="Extraction Confidence"
            value={
              order.extraction_confidence == null
                ? "—"
                : String(order.extraction_confidence)
            }
          />
          <Field
            label="Missing Information Flags"
            value={
              Array.isArray(order.missing_information_flags)
                ? order.missing_information_flags.join(", ") || "—"
                : "—"
            }
          />
          <Field label="Agent Summary" value={order.agent_summary as string} />
        </div>
      </Section>

      {/* Applicant */}
      {applicant && (
        <Section title="Applicant">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Field label="Name" value={applicant.name as string} />
            <Field label="Email" value={applicant.email as string} />
            <Field label="Phone" value={applicant.phone as string} />
            <Field label="Residential Address" value={applicantResidentialAddress} />
          </div>
        </Section>
      )}

      {/* LLC */}
      {llc && (
        <Section title="LLC Details">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Legal Name" value={llc.legal_name as string} />
            <Field label="State" value={llc.state as string} />
            <Field label="Business Activity" value={llc.business_activity_label as string} />
            <Field label="Management Type" value={(llc.management_type as string).replace(/_/g, " ")} />
            <Field label="Member Count" value={llc.member_count as number} />
            <Field label="Principal Address" value={llcPrincipalAddress} />
            <Field
              label="Address Relationship"
              value={
                llc.principal_same_as_applicant_address
                  ? "Same as applicant residential address"
                  : "Separate company principal address"
              }
            />
          </div>
        </Section>
      )}

      {/* Members */}
      {members.length > 0 && (
        <Section title="Members">
          <div className="space-y-3">
            {members.map((m, i) => (
              <div key={m.id as string} className="grid grid-cols-1 sm:grid-cols-3 gap-4 pb-3 border-b border-gray-100 last:border-0 last:pb-0">
                <Field label={`Member ${i + 1} — Name`} value={m.full_name as string} />
                <Field label="Address" value={m.address as string} />
                <Field label="Ownership" value={`${m.ownership_percentage as number}%`} />
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* Registered Agent */}
      {registeredAgent && (
        <Section title="Registered Agent">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Choice" value={registeredAgent.choice as string} />
            {(registeredAgent.name as string) && <Field label="Name" value={registeredAgent.name as string} />}
            {(registeredAgent.address as string) && (
              <Field label="Address" value={`${registeredAgent.address as string}, ${registeredAgent.city as string}, ${registeredAgent.state as string} ${registeredAgent.zip as string}`} />
            )}
          </div>
        </Section>
      )}

      {/* EIN Details */}
      {einDetails && (
        <Section title="EIN Details">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Reason for Applying" value={einDetails.reason_for_applying as string} />
            <Field label="Entity Type" value={einDetails.entity_type as string} />
            <Field label="Responsible Party" value={einDetails.responsible_party_name as string} />
            <Field label="Passport Number" value={einDetails.responsible_party_passport_number as string} />
            <Field label="Start Date" value={einDetails.start_date as string} />
            <Field label="Fiscal Closing Month" value={einDetails.fiscal_closing_month as string} />
          </div>
        </Section>
      )}

      {/* Generated Forms */}
      {generatedForms.length > 0 && (
        <Section title="Generated Forms">
          <div className="space-y-2">
            {generatedForms.map(f => (
              <div key={f.id as string} className="flex items-center gap-3">
                <span className="text-sm text-gray-900">{(f.form_type as string).replace(/_/g, " ")}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${f.customer_approved ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-600"}`}>
                  {f.customer_approved ? "Approved" : "Pending"}
                </span>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* Documents */}
      {docsWithUrls.length > 0 && (
        <Section title="Documents">
          <div className="space-y-3">
            {docsWithUrls.map(doc => (
              <div key={doc.id as string} className="grid gap-3 py-3 border-b border-gray-100 last:border-0 md:grid-cols-[minmax(0,1fr)_auto] md:items-center">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-medium text-gray-900">
                      {(doc.document_type as string).replace(/_/g, " ")}
                    </p>
                    <RetentionBadge status={doc.retention_status as string | null | undefined} />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{doc.file_name as string}</p>
                  <div className="mt-2 grid gap-1 text-xs text-gray-500 sm:grid-cols-3">
                    <span>
                      Retention: {formatToken(doc.retention_category, "sensitive_upload")}
                    </span>
                    <span>
                      Eligible: {doc.retention_eligible_at ? new Date(doc.retention_eligible_at as string).toLocaleDateString("en-US") : "not scheduled"}
                    </span>
                    <span>
                      Deletion: {formatToken(doc.deletion_status, "not_applicable")}
                    </span>
                  </div>
                  {doc.deleted_at ? (
                    <p className="text-xs text-gray-500 mt-1">
                      Deleted {new Date(doc.deleted_at as string).toLocaleDateString("en-US")}
                    </p>
                  ) : null}
                </div>
                <div className="flex flex-wrap gap-2 shrink-0">
                  {doc.viewUrl && (
                    <a
                      href={doc.viewUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 font-semibold transition-colors"
                    >
                      Open
                    </a>
                  )}
                  {doc.downloadUrl && (
                    <a
                      href={doc.downloadUrl}
                      download={doc.file_name as string}
                      className="text-xs px-3 py-1.5 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 font-semibold transition-colors"
                    >
                      Download
                    </a>
                  )}
                  {Boolean(doc.retention_eligible_at) &&
                   new Date(doc.retention_eligible_at as string) <= new Date() &&
                   doc.retention_status !== "deleted" &&
                   doc.deletion_status !== "success" && (
                    <DeleteDocumentButton documentId={doc.id as string} />
                  )}
                </div>
              </div>
            ))}
          </div>
        </Section>
      )}
    </div>
  );
}
