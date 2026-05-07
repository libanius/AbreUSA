"use client";

import { useMemo, useState } from "react";

import {
  FieldGroup,
  FieldShell,
  FormPreviewShell,
  ProgressHeader,
  ReviewSummary,
  StatusMessage,
  StepCard,
  StepNavigation,
} from "@/components/guided-flow-primitives";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type ServiceId = "complete" | "florida_llc";
type FlowStep =
  | "service"
  | "llc_name"
  | "business_activity"
  | "member_count"
  | "member_data"
  | "business_address"
  | "registered_agent"
  | "ein_questions"
  | "documents"
  | "review";
type BusinessActivityId =
  | "tech"
  | "ecomm"
  | "consulting"
  | "import"
  | "construction"
  | "food"
  | "health"
  | "realestate"
  | "education"
  | "other";

type ServiceOption = {
  id: ServiceId;
  title: string;
  description: string;
  price: string;
};

type BusinessActivityOption = {
  id: BusinessActivityId;
  label: string;
};

type MemberDraft = {
  fullName: string;
  address: string;
  ownershipPercentage: string;
};

type BusinessAddressDraft = {
  street: string;
  city: string;
  state: string;
  zip: string;
};

type RegisteredAgentChoice = "abreusa" | "self" | "other";

type RegisteredAgentDraft = {
  choice: RegisteredAgentChoice | null;
  name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
};

type EinReason =
  | "new_business"
  | "banking"
  | "compliance"
  | "employees"
  | "other";

type EinEntityType =
  | "llc_single_disregarded"
  | "llc_multi_partnership"
  | "llc_c_corp_election"
  | "corporation";

type EinQuestionsDraft = {
  reasonForApplying: EinReason | null;
  entityType: EinEntityType | null;
  responsiblePartyName: string;
  responsiblePartyPassportNumber: string;
  startDate: string;
  fiscalClosingMonth: string;
};

type DocumentKind = "passport" | "addressProof";

type DocumentFileDraft = {
  name: string;
  size: number;
  type: string;
};

type DocumentExtractionDraft = {
  fullName: string;
  dateOfBirth: string;
  passportNumber: string;
  passportExpiration: string;
  nationality: string;
  streetAddress: string;
  city: string;
  state: string;
  zip: string;
};

type DocumentCollectionDraft = {
  passport: DocumentFileDraft | null;
  addressProof: DocumentFileDraft | null;
  extraction: DocumentExtractionDraft;
};

const serviceOptions: ServiceOption[] = [
  {
    id: "complete",
    title: "Pacote Completo — LLC + EIN",
    description: "Abertura na Flórida com suporte para EIN.",
    price: "$499",
  },
  {
    id: "florida_llc",
    title: "LLC na Flórida",
    description: "Formação da empresa com Articles of Organization.",
    price: "$299",
  },
];

const businessActivityOptions: BusinessActivityOption[] = [
  { id: "tech", label: "Tecnologia / Software" },
  { id: "ecomm", label: "E-commerce / Vendas online" },
  { id: "consulting", label: "Consultoria / Serviços profissionais" },
  { id: "import", label: "Importação e Exportação" },
  { id: "construction", label: "Construção Civil" },
  { id: "food", label: "Alimentação / Food service" },
  { id: "health", label: "Saúde e Beleza" },
  { id: "realestate", label: "Imóveis / Real Estate" },
  { id: "education", label: "Educação" },
  { id: "other", label: "Outro" },
];

const progressItems = [
  "Serviço",
  "Empresa",
  "Atividade",
  "Sócios",
  "Dados",
  "Endereço",
  "Agente",
  "EIN",
  "Documentos",
  "Revisão",
  "Envio",
];
const einReasonOptions: { id: EinReason; label: string; description: string }[] = [
  { id: "new_business", label: "Novo negócio", description: "Abertura de uma nova empresa nos EUA." },
  { id: "banking", label: "Conta bancária", description: "Necessário para abertura de conta nos EUA." },
  { id: "compliance", label: "Conformidade fiscal", description: "Exigência de órgão regulatório ou contrato." },
  { id: "employees", label: "Contratação de funcionários", description: "A empresa terá funcionários nos EUA." },
  { id: "other", label: "Outro motivo", description: "Finalidade diferente das listadas acima." },
];

const einEntityTypeOptions: { id: EinEntityType; label: string; description: string }[] = [
  {
    id: "llc_single_disregarded",
    label: "LLC — Membro único (Disregarded Entity)",
    description: "LLC com um único sócio tratada como entidade desconsiderada pelo IRS.",
  },
  {
    id: "llc_multi_partnership",
    label: "LLC — Múltiplos sócios (Partnership)",
    description: "LLC com dois ou mais sócios tratada como parceria pelo IRS.",
  },
  {
    id: "llc_c_corp_election",
    label: "LLC — Eleição de C-Corporation",
    description: "LLC que optou por ser tributada como C-Corp.",
  },
  {
    id: "corporation",
    label: "Corporation (C-Corp)",
    description: "Empresa constituída como corporação nos EUA.",
  },
];

const fiscalMonthOptions = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
];

const registeredAgentOptions: {
  id: RegisteredAgentChoice;
  title: string;
  description: string;
}[] = [
  {
    id: "abreusa",
    title: "AbreUSA",
    description: "AbreUSA Registered Agent Services LLC — Miami, FL.",
  },
  {
    id: "self",
    title: "Próprio sócio",
    description: "Um dos sócios atuará como Registered Agent na Flórida.",
  },
  {
    id: "other",
    title: "Outro agente",
    description: "Informe o nome e endereço do Registered Agent escolhido.",
  },
];

const llcSuffixPattern =
  /\b(l\.?\s?l\.?\s?c\.?|limited liability company)\.?$/i;

const emptyDocumentCollection: DocumentCollectionDraft = {
  passport: null,
  addressProof: null,
  extraction: {
    fullName: "",
    dateOfBirth: "",
    passportNumber: "",
    passportExpiration: "",
    nationality: "",
    streetAddress: "",
    city: "",
    state: "",
    zip: "",
  },
};

function formatFileSize(size: number) {
  if (size >= 1024 * 1024) {
    return `${(size / (1024 * 1024)).toFixed(1)} MB`;
  }

  return `${Math.max(1, Math.round(size / 1024))} KB`;
}

function ServiceSelection({
  selectedService,
  onSelect,
}: {
  selectedService: ServiceId | null;
  onSelect: (service: ServiceId) => void;
}) {
  return (
    <FieldGroup title="Escolha o serviço">
      <div className="grid gap-3">
        {serviceOptions.map((service) => {
          const selected = service.id === selectedService;

          return (
            <button
              aria-pressed={selected}
              className={cn(
                "rounded-md border bg-card p-4 text-left transition-colors",
                "focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/40",
                selected
                  ? "border-emerald-600 bg-emerald-50"
                  : "hover:border-emerald-300 hover:bg-emerald-50/40",
              )}
              key={service.id}
              onClick={() => onSelect(service.id)}
              type="button"
            >
              <div className="flex gap-4">
                <span
                  className={cn(
                    "mt-1 size-3 rounded-full border",
                    selected
                      ? "border-emerald-600 bg-emerald-600"
                      : "border-muted-foreground/40",
                  )}
                />
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-semibold text-foreground">
                    {service.title}
                  </span>
                  <span className="mt-1 block text-sm leading-6 text-muted-foreground">
                    {service.description}
                  </span>
                </span>
                <span className="shrink-0 text-sm font-semibold text-foreground">
                  {service.price}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </FieldGroup>
  );
}

function StepFrame({
  activeStep,
  businessActivity,
  businessAddress,
  customBusinessActivity,
  llcName,
  memberCount,
  memberData,
  einQuestions,
  documents,
  registeredAgent,
  onBackToBusinessActivity,
  onBackToBusinessAddress,
  onBackToMemberCount,
  onBackToLlcName,
  onBackToMemberData,
  onBackToRegisteredAgent,
  onBackFromDocuments,
  onBackToDocuments,
  onChangeBusinessActivity,
  onChangeBusinessAddress,
  onChangeCustomBusinessActivity,
  onChangeDocumentExtraction,
  onChangeDocumentFile,
  onChangeEinQuestions,
  onChangeLlcName,
  onChangeMemberData,
  onChangeMemberCount,
  onChangeRegisteredAgent,
  onContinueToBusinessActivity,
  onContinueToBusinessAddress,
  onContinueToEinQuestions,
  onContinueToDocuments,
  onContinueToReview,
  onContinueToMemberData,
  onContinueToMemberCount,
  onContinueToRegisteredAgent,
  onResetService,
  selectedService,
  onSelectService,
}: {
  activeStep: FlowStep;
  businessActivity: BusinessActivityId | null;
  businessAddress: BusinessAddressDraft;
  customBusinessActivity: string;
  documents: DocumentCollectionDraft;
  einQuestions: EinQuestionsDraft;
  llcName: string;
  memberCount: number;
  memberData: MemberDraft[];
  registeredAgent: RegisteredAgentDraft;
  onBackToBusinessActivity: () => void;
  onBackToBusinessAddress: () => void;
  onBackToMemberCount: () => void;
  onBackToLlcName: () => void;
  onBackToMemberData: () => void;
  onBackToRegisteredAgent: () => void;
  onBackFromDocuments: () => void;
  onBackToDocuments: () => void;
  onChangeBusinessActivity: (activity: BusinessActivityId) => void;
  onChangeBusinessAddress: (field: keyof BusinessAddressDraft, value: string) => void;
  onChangeCustomBusinessActivity: (activity: string) => void;
  onChangeDocumentExtraction: (
    field: keyof DocumentExtractionDraft,
    value: string,
  ) => void;
  onChangeDocumentFile: (kind: DocumentKind, file: File | null) => void;
  onChangeEinQuestions: (field: keyof EinQuestionsDraft, value: string) => void;
  onChangeLlcName: (name: string) => void;
  onChangeMemberData: (
    index: number,
    field: keyof MemberDraft,
    value: string,
  ) => void;
  onChangeMemberCount: (count: number) => void;
  onChangeRegisteredAgent: (field: keyof RegisteredAgentDraft, value: string) => void;
  onContinueToBusinessActivity: () => void;
  onContinueToBusinessAddress: () => void;
  onContinueToEinQuestions: () => void;
  onContinueToDocuments: () => void;
  onContinueToReview: () => void;
  onContinueToMemberData: () => void;
  onContinueToMemberCount: () => void;
  onContinueToRegisteredAgent: () => void;
  onResetService: () => void;
  selectedService: ServiceId | null;
  onSelectService: (service: ServiceId) => void;
}) {
  const selectedLabel = useMemo(() => {
    return serviceOptions.find((service) => service.id === selectedService)
      ?.title;
  }, [selectedService]);
  const trimmedLlcName = llcName.trim();
  const hasLlcName = trimmedLlcName.length > 0;
  const hasValidSuffix = llcSuffixPattern.test(trimmedLlcName);
  const selectedActivityLabel =
    businessActivity === "other"
      ? customBusinessActivity.trim()
      : businessActivityOptions.find((activity) => activity.id === businessActivity)
          ?.label;
  const visibleMembers = Array.from({ length: memberCount }, (_, index) => {
    return (
      memberData[index] ?? {
        fullName: "",
        address: "",
        ownershipPercentage: String(Math.round(100 / memberCount)),
      }
    );
  });
  const ownershipTotal = visibleMembers.reduce((total, member) => {
    return total + (Number(member.ownershipPercentage) || 0);
  }, 0);
  const hasOwnershipEntries = visibleMembers.some(
    (member) => member.ownershipPercentage.trim().length > 0,
  );
  const ownershipMatches = ownershipTotal === 100;
  const selectedReasonLabel =
    einReasonOptions.find((o) => o.id === einQuestions.reasonForApplying)?.label ??
    null;
  const selectedEntityLabel =
    einEntityTypeOptions.find((o) => o.id === einQuestions.entityType)?.label ??
    null;
  const registeredAgentLabel =
    registeredAgent.choice === "abreusa"
      ? "AbreUSA"
      : registeredAgent.choice === "self"
      ? "Próprio sócio"
      : registeredAgent.choice === "other"
      ? registeredAgent.name.trim() || "Outro agente"
      : "Pendente";

  if (activeStep === "review") {
    const businessAddressSummary =
      businessAddress.street && businessAddress.city && businessAddress.zip
        ? `${businessAddress.street}, ${businessAddress.city}, ${businessAddress.state} ${businessAddress.zip}`
        : "Pendente";
    const memberSummary = visibleMembers
      .map((member, index) => {
        const name = member.fullName.trim() || `Sócio ${index + 1}`;
        const percent = member.ownershipPercentage.trim() || "0";

        return `${name} — ${percent}%`;
      })
      .join("; ");
    const extractionAddress =
      documents.extraction.streetAddress ||
      documents.extraction.city ||
      documents.extraction.state ||
      documents.extraction.zip
        ? `${documents.extraction.streetAddress || "Rua pendente"}, ${
            documents.extraction.city || "Cidade pendente"
          }, ${documents.extraction.state || "UF"} ${
            documents.extraction.zip || "ZIP pendente"
          }`
        : "Pendente";

    return (
      <StepCard
        badge="Preview local"
        eyebrow="Passo 10 · Revisão"
        title="Revise os dados e os previews"
      >
        <div className="grid gap-3">
          <StatusMessage title="Ainda não enviado" tone="warning">
            <p>
              Estes dados e formulários são previews locais. Nada foi enviado
              para a AbreUSA, Sunbiz ou IRS nesta etapa.
            </p>
          </StatusMessage>

          <ReviewSummary
            items={[
              { label: "Serviço", value: selectedLabel ?? "Pendente" },
              { label: "Estado", value: "Florida" },
              { label: "Nome LLC", value: trimmedLlcName || "Pendente" },
              { label: "Atividade", value: selectedActivityLabel || "Pendente" },
            ]}
            title="Resumo do pedido"
          />

          <ReviewSummary
            items={[
              { label: "Sócios", value: memberSummary || "Pendente" },
              { label: "Participação total", value: `${ownershipTotal}%` },
              { label: "Endereço principal", value: businessAddressSummary },
              { label: "Registered Agent", value: registeredAgentLabel },
            ]}
            title="LLC e formação na Flórida"
          />

          {selectedService === "complete" ? (
            <ReviewSummary
              items={[
                { label: "Motivo EIN", value: selectedReasonLabel ?? "Pendente" },
                { label: "Tipo de entidade", value: selectedEntityLabel ?? "Pendente" },
                {
                  label: "Responsible Party",
                  value: einQuestions.responsiblePartyName.trim() || "Pendente",
                },
                {
                  label: "Passaporte do responsável",
                  value:
                    einQuestions.responsiblePartyPassportNumber.trim() ||
                    "Pendente",
                },
                {
                  label: "Data de início",
                  value: einQuestions.startDate || "Pendente",
                },
                {
                  label: "Mês fiscal",
                  value: einQuestions.fiscalClosingMonth || "Pendente",
                },
              ]}
              title="EIN / IRS SS-4"
            />
          ) : null}

          <ReviewSummary
            items={[
              {
                label: "Passaporte",
                value: documents.passport?.name ?? "Pendente",
              },
              {
                label: "Comprovante EUA",
                value: documents.addressProof?.name ?? "Pendente",
              },
              {
                label: "Nome extraído",
                value: documents.extraction.fullName || "Pendente",
              },
              {
                label: "Passaporte extraído",
                value: documents.extraction.passportNumber || "Pendente",
              },
              {
                label: "Nacionalidade",
                value: documents.extraction.nationality || "Pendente",
              },
              { label: "Endereço extraído", value: extractionAddress },
            ]}
            title="Documentos e extração placeholder"
          />

          <FieldGroup title="Preview — Florida Articles of Organization">
            <StatusMessage title="Preview não submetido" tone="info">
              <p>
                Este preview usa os dados locais da LLC e não representa
                protocolo ou submissão oficial.
              </p>
            </StatusMessage>
            <ReviewSummary
              items={[
                { label: "Article I — LLC Name", value: trimmedLlcName },
                { label: "Principal Office", value: businessAddressSummary },
                { label: "Registered Agent", value: registeredAgentLabel },
                {
                  label: "Management",
                  value: memberCount === 1 ? "Member-managed, one member" : "Member-managed, multiple members",
                },
              ]}
              title="Dados mapeados para o preview"
            />
            <FormPreviewShell
              sections={["Article I — Name", "Article II — Address", "Article III — Registered Agent"]}
              subtitle="Preview only · State of Florida · Division of Corporations"
              title="Articles of Organization"
            />
          </FieldGroup>

          {selectedService === "complete" ? (
            <FieldGroup title="Preview — IRS Form SS-4">
              <StatusMessage title="Preview não submetido" tone="info">
                <p>
                  Este preview usa os dados locais do EIN e não representa
                  protocolo, fax, envio ou emissão pelo IRS.
                </p>
              </StatusMessage>
              <ReviewSummary
                items={[
                  { label: "Line 1 — Legal name", value: trimmedLlcName },
                  {
                    label: "Responsible Party",
                    value: einQuestions.responsiblePartyName.trim() || "Pendente",
                  },
                  {
                    label: "Passport context",
                    value:
                      einQuestions.responsiblePartyPassportNumber.trim() ||
                      documents.extraction.passportNumber ||
                      "Pendente",
                  },
                  {
                    label: "Line 10 — Reason",
                    value: selectedReasonLabel ?? "Pendente",
                  },
                ]}
                title="Dados mapeados para o preview"
              />
              <FormPreviewShell
                sections={["Line 1 — Legal name", "Line 7b — SSN/ITIN/EIN", "Line 10 — Reason"]}
                subtitle="Preview only · Department of the Treasury · IRS"
                title="Form SS-4"
              />
            </FieldGroup>
          ) : null}
        </div>
        <StepNavigation
          backDisabled={false}
          backLabel="Voltar"
          nextDisabled
          nextLabel="Aprovação (próxima fase)"
          onBack={onBackToDocuments}
        />
      </StepCard>
    );
  }

  if (activeStep === "documents") {
    const hasPassport = documents.passport !== null;
    const hasAddressProof = documents.addressProof !== null;
    const isDocumentCollectionComplete = hasPassport && hasAddressProof;

    return (
      <StepCard
        badge="Rascunho local"
        eyebrow="Passo 9 · Documentos"
        title="Envie os documentos necessários"
      >
        <div className="grid gap-3">
          <StatusMessage
            title={
              isDocumentCollectionComplete
                ? "Documentos anexados"
                : "Documentos pendentes"
            }
            tone={isDocumentCollectionComplete ? "success" : "info"}
          >
            <p>
              {isDocumentCollectionComplete
                ? "Os arquivos foram capturados apenas neste rascunho local. Nenhum upload para servidor foi feito."
                : "Anexe o passaporte e um comprovante de endereço nos EUA para revisar os dados extraídos manualmente."}
            </p>
          </StatusMessage>

          <FieldGroup title="Arquivos obrigatórios">
            {[
              {
                kind: "passport" as const,
                label: "Passaporte com foto",
                hint: "Página do passaporte com foto e dados pessoais.",
                file: documents.passport,
              },
              {
                kind: "addressProof" as const,
                label: "Comprovante de endereço nos EUA",
                hint: "Conta, extrato, contrato de aluguel ou documento similar.",
                file: documents.addressProof,
              },
            ].map((documentItem) => (
              <div
                className="grid gap-3 rounded-md border bg-card p-4"
                key={documentItem.kind}
              >
                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      {documentItem.label}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {documentItem.hint}
                    </p>
                  </div>
                  <span
                    className={cn(
                      "w-fit rounded-md border px-2 py-1 text-xs font-semibold",
                      documentItem.file
                        ? "border-emerald-200 bg-emerald-50 text-emerald-900"
                        : "border-amber-200 bg-amber-50 text-amber-900",
                    )}
                  >
                    {documentItem.file ? "Anexado localmente" : "Pendente"}
                  </span>
                </div>

                <Input
                  accept=".pdf,.jpg,.jpeg,.png,.webp"
                  onChange={(event) =>
                    onChangeDocumentFile(
                      documentItem.kind,
                      event.target.files?.[0] ?? null,
                    )
                  }
                  type="file"
                />

                {documentItem.file ? (
                  <div className="rounded-md border bg-background p-3 text-sm text-muted-foreground">
                    <span className="font-medium text-foreground">
                      {documentItem.file.name}
                    </span>
                    <span className="mx-2">·</span>
                    <span>{formatFileSize(documentItem.file.size)}</span>
                    {documentItem.file.type ? (
                      <>
                        <span className="mx-2">·</span>
                        <span>{documentItem.file.type}</span>
                      </>
                    ) : null}
                  </div>
                ) : null}
              </div>
            ))}
          </FieldGroup>

          <FieldGroup title="Revisão manual da extração placeholder">
            <StatusMessage title="Extração simulada" tone="warning">
              <p>
                Estes campos representam a revisão manual do MVP. Eles devem ser
                confirmados pelo cliente antes de qualquer envio para a AbreUSA.
              </p>
            </StatusMessage>
            <FieldShell label="Nome completo">
              <Input
                onChange={(event) =>
                  onChangeDocumentExtraction("fullName", event.target.value)
                }
                placeholder="Como no passaporte"
                value={documents.extraction.fullName}
              />
            </FieldShell>
            <div className="grid gap-4 sm:grid-cols-2">
              <FieldShell label="Data de nascimento">
                <Input
                  onChange={(event) =>
                    onChangeDocumentExtraction("dateOfBirth", event.target.value)
                  }
                  type="date"
                  value={documents.extraction.dateOfBirth}
                />
              </FieldShell>
              <FieldShell label="Nacionalidade">
                <Input
                  onChange={(event) =>
                    onChangeDocumentExtraction("nationality", event.target.value)
                  }
                  placeholder="Ex.: Brasileira"
                  value={documents.extraction.nationality}
                />
              </FieldShell>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <FieldShell label="Número do passaporte">
                <Input
                  onChange={(event) =>
                    onChangeDocumentExtraction("passportNumber", event.target.value)
                  }
                  placeholder="Ex.: AB123456"
                  value={documents.extraction.passportNumber}
                />
              </FieldShell>
              <FieldShell label="Validade do passaporte">
                <Input
                  onChange={(event) =>
                    onChangeDocumentExtraction(
                      "passportExpiration",
                      event.target.value,
                    )
                  }
                  type="date"
                  value={documents.extraction.passportExpiration}
                />
              </FieldShell>
            </div>
            <FieldShell label="Endereço nos EUA">
              <Input
                onChange={(event) =>
                  onChangeDocumentExtraction("streetAddress", event.target.value)
                }
                placeholder="Rua e número"
                value={documents.extraction.streetAddress}
              />
            </FieldShell>
            <div className="grid gap-4 sm:grid-cols-3">
              <FieldShell label="Cidade">
                <Input
                  onChange={(event) =>
                    onChangeDocumentExtraction("city", event.target.value)
                  }
                  value={documents.extraction.city}
                />
              </FieldShell>
              <FieldShell label="Estado">
                <Input
                  maxLength={2}
                  onChange={(event) =>
                    onChangeDocumentExtraction("state", event.target.value)
                  }
                  placeholder="FL"
                  value={documents.extraction.state}
                />
              </FieldShell>
              <FieldShell label="ZIP Code">
                <Input
                  inputMode="numeric"
                  maxLength={10}
                  onChange={(event) =>
                    onChangeDocumentExtraction("zip", event.target.value)
                  }
                  value={documents.extraction.zip}
                />
              </FieldShell>
            </div>
          </FieldGroup>

          <ReviewSummary
            items={[
              { label: "Serviço", value: selectedLabel ?? "Pendente" },
              { label: "Nome LLC", value: trimmedLlcName },
              {
                label: "Passaporte",
                value: documents.passport?.name ?? "Pendente",
              },
              {
                label: "Comprovante",
                value: documents.addressProof?.name ?? "Pendente",
              },
            ]}
            title="Resumo"
          />
        </div>
        <StepNavigation
          backDisabled={false}
          backLabel="Voltar"
          nextDisabled={!isDocumentCollectionComplete}
          nextLabel={
            isDocumentCollectionComplete
              ? "Continuar"
              : "Anexar documentos"
          }
          onBack={onBackFromDocuments}
          onNext={onContinueToReview}
        />
      </StepCard>
    );
  }

  if (activeStep === "member_data") {
    return (
      <StepCard
        badge="Rascunho local"
        eyebrow="Passo 5 · Dados dos sócios"
        title="Dados de cada sócio"
      >
        <div className="grid gap-3">
          <StatusMessage
            title={ownershipMatches ? "Participação total: 100%" : "Revise as participações"}
            tone={ownershipMatches ? "success" : "warning"}
          >
            <p>
              {ownershipMatches
                ? "A soma das participações informadas está em 100%."
                : `A soma atual é ${ownershipTotal}%. Ajuste os percentuais para totalizar 100%.`}
            </p>
          </StatusMessage>

          <FieldGroup title="Informações dos sócios">
            {visibleMembers.map((member, index) => {
              const memberLabel =
                index === 0 ? "Sócio principal" : `Sócio ${index + 1}`;

              return (
                <div
                  className="grid gap-4 rounded-md border bg-card p-4"
                  key={index}
                >
                  <p className="text-sm font-semibold text-foreground">
                    {memberLabel}
                  </p>
                  <FieldShell label="Nome completo">
                    <Input
                      onChange={(event) =>
                        onChangeMemberData(index, "fullName", event.target.value)
                      }
                      placeholder="Como no passaporte"
                      value={member.fullName}
                    />
                  </FieldShell>
                  <FieldShell label="Endereço">
                    <Input
                      onChange={(event) =>
                        onChangeMemberData(index, "address", event.target.value)
                      }
                      placeholder="Street, City, State, ZIP"
                      value={member.address}
                    />
                  </FieldShell>
                  <FieldShell label="Participação (%)">
                    <Input
                      inputMode="numeric"
                      max={100}
                      min={1}
                      onChange={(event) =>
                        onChangeMemberData(
                          index,
                          "ownershipPercentage",
                          event.target.value,
                        )
                      }
                      type="number"
                      value={member.ownershipPercentage}
                    />
                  </FieldShell>
                </div>
              );
            })}
          </FieldGroup>

          <ReviewSummary
            items={[
              { label: "Serviço", value: selectedLabel ?? "Pendente" },
              { label: "Nome", value: trimmedLlcName },
              { label: "Sócios", value: String(memberCount) },
              {
                label: "Participação",
                value: hasOwnershipEntries ? `${ownershipTotal}%` : "Pendente",
              },
            ]}
            title="Resumo"
          />

          <FormPreviewShell
            sections={["Article I", "Article II", "Article III"]}
            subtitle="State of Florida · Division of Corporations"
            title="Articles of Organization"
          />
        </div>
        <StepNavigation
          backDisabled={false}
          backLabel="Voltar"
          nextDisabled={!ownershipMatches}
          nextLabel={ownershipMatches ? "Continuar" : "Ajustar participações"}
          onBack={onBackToMemberCount}
          onNext={onContinueToBusinessAddress}
        />
      </StepCard>
    );
  }

  if (activeStep === "ein_questions") {
    const hasResponsibleName = einQuestions.responsiblePartyName.trim().length > 0;
    const hasPassportNumber = einQuestions.responsiblePartyPassportNumber.trim().length > 0;
    const isEinComplete =
      einQuestions.reasonForApplying !== null &&
      einQuestions.entityType !== null &&
      hasResponsibleName &&
      hasPassportNumber;

    return (
      <StepCard
        badge="Rascunho local"
        eyebrow="Passo 8 · EIN / IRS SS-4"
        title="Informações para o EIN"
      >
        <div className="grid gap-3">
          <StatusMessage
            title={isEinComplete ? "Dados do EIN completos" : "Dados pendentes"}
            tone={isEinComplete ? "success" : "info"}
          >
            <p>
              {isEinComplete
                ? "As informações para o EIN foram registradas localmente."
                : "Preencha os campos obrigatórios para continuar para a próxima etapa."}
            </p>
          </StatusMessage>

          <FieldGroup title="Motivo da solicitação">
            <div className="grid gap-2">
              {einReasonOptions.map((option) => {
                const selected = option.id === einQuestions.reasonForApplying;

                return (
                  <button
                    aria-pressed={selected}
                    className={cn(
                      "rounded-md border bg-card p-3 text-left transition-colors",
                      "focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/40",
                      selected
                        ? "border-emerald-600 bg-emerald-50"
                        : "hover:border-emerald-300 hover:bg-emerald-50/40",
                    )}
                    key={option.id}
                    onClick={() => onChangeEinQuestions("reasonForApplying", option.id)}
                    type="button"
                  >
                    <div className="flex gap-3">
                      <span
                        className={cn(
                          "mt-0.5 size-3 shrink-0 rounded-full border",
                          selected
                            ? "border-emerald-600 bg-emerald-600"
                            : "border-muted-foreground/40",
                        )}
                      />
                      <span className="min-w-0">
                        <span className="block text-sm font-semibold text-foreground">
                          {option.label}
                        </span>
                        <span className="block text-xs text-muted-foreground">
                          {option.description}
                        </span>
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </FieldGroup>

          <FieldGroup title="Tipo de entidade (Form SS-4)">
            <div className="grid gap-2">
              {einEntityTypeOptions.map((option) => {
                const selected = option.id === einQuestions.entityType;

                return (
                  <button
                    aria-pressed={selected}
                    className={cn(
                      "rounded-md border bg-card p-3 text-left transition-colors",
                      "focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/40",
                      selected
                        ? "border-emerald-600 bg-emerald-50"
                        : "hover:border-emerald-300 hover:bg-emerald-50/40",
                    )}
                    key={option.id}
                    onClick={() => onChangeEinQuestions("entityType", option.id)}
                    type="button"
                  >
                    <div className="flex gap-3">
                      <span
                        className={cn(
                          "mt-0.5 size-3 shrink-0 rounded-full border",
                          selected
                            ? "border-emerald-600 bg-emerald-600"
                            : "border-muted-foreground/40",
                        )}
                      />
                      <span className="min-w-0">
                        <span className="block text-sm font-semibold text-foreground">
                          {option.label}
                        </span>
                        <span className="block text-xs text-muted-foreground">
                          {option.description}
                        </span>
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </FieldGroup>

          <FieldGroup title="Responsável pelo EIN (Responsible Party)">
            <FieldShell
              hint="Nome exatamente como consta no passaporte."
              label="Nome completo"
            >
              <Input
                onChange={(event) =>
                  onChangeEinQuestions("responsiblePartyName", event.target.value)
                }
                placeholder="Como no passaporte"
                value={einQuestions.responsiblePartyName}
              />
            </FieldShell>
            <FieldShell label="Número do passaporte">
              <Input
                onChange={(event) =>
                  onChangeEinQuestions("responsiblePartyPassportNumber", event.target.value)
                }
                placeholder="Ex.: AB123456"
                value={einQuestions.responsiblePartyPassportNumber}
              />
            </FieldShell>
          </FieldGroup>

          <FieldGroup title="Dados adicionais (SS-4)">
            <FieldShell
              hint="Data de início das atividades ou constituição da LLC."
              label="Data de início"
            >
              <Input
                onChange={(event) =>
                  onChangeEinQuestions("startDate", event.target.value)
                }
                placeholder="MM/DD/AAAA"
                type="date"
                value={einQuestions.startDate}
              />
            </FieldShell>
            <FieldShell
              hint="Mês de encerramento do exercício fiscal. Geralmente dezembro para novos negócios."
              label="Mês de encerramento fiscal"
            >
              <select
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                onChange={(event) =>
                  onChangeEinQuestions("fiscalClosingMonth", event.target.value)
                }
                value={einQuestions.fiscalClosingMonth}
              >
                <option value="">Selecionar mês</option>
                {fiscalMonthOptions.map((month) => (
                  <option key={month} value={month}>
                    {month}
                  </option>
                ))}
              </select>
            </FieldShell>
          </FieldGroup>

          <ReviewSummary
            items={[
              { label: "Serviço", value: selectedLabel ?? "Pendente" },
              { label: "Nome LLC", value: trimmedLlcName },
              { label: "Motivo EIN", value: selectedReasonLabel ?? "Pendente" },
              { label: "Entidade", value: selectedEntityLabel ?? "Pendente" },
              {
                label: "Responsável",
                value: hasResponsibleName
                  ? einQuestions.responsiblePartyName.trim()
                  : "Pendente",
              },
            ]}
            title="Resumo"
          />

          <FormPreviewShell
            sections={["Line 1 — Legal name", "Line 7b — SSN/ITIN/EIN", "Line 10 — Reason"]}
            subtitle="Department of the Treasury · Internal Revenue Service"
            title="Form SS-4"
          />
        </div>
        <StepNavigation
          backDisabled={false}
          backLabel="Voltar"
          nextDisabled={!isEinComplete}
          nextLabel="Continuar"
          onBack={onBackToRegisteredAgent}
          onNext={onContinueToDocuments}
        />
      </StepCard>
    );
  }

  if (activeStep === "registered_agent") {
    const isOther = registeredAgent.choice === "other";
    const hasOtherName = registeredAgent.name.trim().length > 0;
    const hasOtherAddress = registeredAgent.address.trim().length > 0;
    const hasOtherCity = registeredAgent.city.trim().length > 0;
    const hasOtherZip = registeredAgent.zip.trim().length > 0;
    const isAgentComplete =
      registeredAgent.choice === "abreusa" ||
      registeredAgent.choice === "self" ||
      (isOther && hasOtherName && hasOtherAddress && hasOtherCity && hasOtherZip);
    const selectedAgentLabel =
      registeredAgentLabel === "Pendente" ? null : registeredAgentLabel;

    return (
      <StepCard
        badge="Rascunho local"
        eyebrow="Passo 7 · Registered Agent"
        title="Quem será o Registered Agent?"
      >
        <div className="grid gap-3">
          <StatusMessage
            title={isAgentComplete ? "Agente selecionado" : "Seleção pendente"}
            tone={isAgentComplete ? "success" : "info"}
          >
            <p>
              {isAgentComplete
                ? "O Registered Agent foi registrado localmente para esta etapa."
                : "Selecione o Registered Agent para a LLC na Flórida."}
            </p>
          </StatusMessage>

          <FieldGroup title="Registered Agent">
            <div className="grid gap-3">
              {registeredAgentOptions.map((option) => {
                const selected = option.id === registeredAgent.choice;

                return (
                  <button
                    aria-pressed={selected}
                    className={cn(
                      "rounded-md border bg-card p-4 text-left transition-colors",
                      "focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/40",
                      selected
                        ? "border-emerald-600 bg-emerald-50"
                        : "hover:border-emerald-300 hover:bg-emerald-50/40",
                    )}
                    key={option.id}
                    onClick={() => onChangeRegisteredAgent("choice", option.id)}
                    type="button"
                  >
                    <div className="flex gap-4">
                      <span
                        className={cn(
                          "mt-1 size-3 shrink-0 rounded-full border",
                          selected
                            ? "border-emerald-600 bg-emerald-600"
                            : "border-muted-foreground/40",
                        )}
                      />
                      <span className="min-w-0 flex-1">
                        <span className="block text-sm font-semibold text-foreground">
                          {option.title}
                        </span>
                        <span className="mt-1 block text-sm leading-6 text-muted-foreground">
                          {option.description}
                        </span>
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            {isOther ? (
              <div className="grid gap-4 rounded-md border bg-card p-4">
                <p className="text-sm font-semibold text-foreground">
                  Dados do Registered Agent
                </p>
                <FieldShell label="Nome completo do agente">
                  <Input
                    onChange={(event) =>
                      onChangeRegisteredAgent("name", event.target.value)
                    }
                    placeholder="Ex.: Florida Registered Agent LLC"
                    value={registeredAgent.name}
                  />
                </FieldShell>
                <FieldShell label="Endereço">
                  <Input
                    onChange={(event) =>
                      onChangeRegisteredAgent("address", event.target.value)
                    }
                    placeholder="Ex.: 123 Main St"
                    value={registeredAgent.address}
                  />
                </FieldShell>
                <FieldShell label="Cidade">
                  <Input
                    onChange={(event) =>
                      onChangeRegisteredAgent("city", event.target.value)
                    }
                    placeholder="Ex.: Orlando"
                    value={registeredAgent.city}
                  />
                </FieldShell>
                <FieldShell
                  hint="Estado fixo: Flórida (FL). O Registered Agent deve estar na Flórida."
                  label="Estado"
                >
                  <Input disabled readOnly value={registeredAgent.state} />
                </FieldShell>
                <FieldShell label="ZIP Code">
                  <Input
                    inputMode="numeric"
                    maxLength={10}
                    onChange={(event) =>
                      onChangeRegisteredAgent("zip", event.target.value)
                    }
                    placeholder="Ex.: 32801"
                    value={registeredAgent.zip}
                  />
                </FieldShell>
              </div>
            ) : null}
          </FieldGroup>

          <ReviewSummary
            items={[
              { label: "Serviço", value: selectedLabel ?? "Pendente" },
              { label: "Nome", value: trimmedLlcName },
              {
                label: "Endereço",
                value: businessAddress.city
                  ? `${businessAddress.city}, FL`
                  : "Pendente",
              },
              {
                label: "Agente",
                value: selectedAgentLabel ?? "Pendente",
              },
            ]}
            title="Resumo"
          />

          <FormPreviewShell
            sections={["Article I", "Article II", "Article III"]}
            subtitle="State of Florida · Division of Corporations"
            title="Articles of Organization"
          />
        </div>
        <StepNavigation
          backDisabled={false}
          backLabel="Voltar"
          nextDisabled={!isAgentComplete}
          nextLabel={
            !isAgentComplete
              ? "Selecionar agente"
              : selectedService === "complete"
              ? "Continuar"
              : "Continuar"
          }
          onBack={onBackToBusinessAddress}
          onNext={
            isAgentComplete && selectedService === "complete"
              ? onContinueToEinQuestions
              : onContinueToDocuments
          }
        />
      </StepCard>
    );
  }

  if (activeStep === "business_address") {
    const hasStreet = businessAddress.street.trim().length > 0;
    const hasCity = businessAddress.city.trim().length > 0;
    const hasZip = businessAddress.zip.trim().length > 0;
    const isAddressComplete = hasStreet && hasCity && hasZip;

    return (
      <StepCard
        badge="Rascunho local"
        eyebrow="Passo 6 · Endereço"
        title="Endereço principal da empresa"
      >
        <div className="grid gap-3">
          <StatusMessage
            title={isAddressComplete ? "Endereço completo" : "Endereço pendente"}
            tone={isAddressComplete ? "success" : "info"}
          >
            <p>
              {isAddressComplete
                ? "O endereço principal da LLC foi capturado localmente."
                : "Informe o endereço da sede da empresa na Flórida para continuar."}
            </p>
          </StatusMessage>

          <FieldGroup title="Endereço da sede (Florida)">
            <FieldShell
              hint="Endereço completo da sede principal da LLC nos EUA."
              label="Rua e número"
            >
              <Input
                onChange={(event) =>
                  onChangeBusinessAddress("street", event.target.value)
                }
                placeholder="Ex.: 1000 Brickell Ave, Suite 100"
                value={businessAddress.street}
              />
            </FieldShell>
            <FieldShell label="Cidade">
              <Input
                onChange={(event) =>
                  onChangeBusinessAddress("city", event.target.value)
                }
                placeholder="Ex.: Miami"
                value={businessAddress.city}
              />
            </FieldShell>
            <FieldShell
              hint="Estado fixo: Flórida (FL) para o MVP."
              label="Estado"
            >
              <Input
                disabled
                readOnly
                value={businessAddress.state}
              />
            </FieldShell>
            <FieldShell label="ZIP Code">
              <Input
                inputMode="numeric"
                maxLength={10}
                onChange={(event) =>
                  onChangeBusinessAddress("zip", event.target.value)
                }
                placeholder="Ex.: 33131"
                value={businessAddress.zip}
              />
            </FieldShell>
          </FieldGroup>

          <ReviewSummary
            items={[
              { label: "Serviço", value: selectedLabel ?? "Pendente" },
              { label: "Nome", value: trimmedLlcName },
              { label: "Sócios", value: String(memberCount) },
              {
                label: "Endereço",
                value: isAddressComplete
                  ? `${businessAddress.city}, FL`
                  : "Pendente",
              },
            ]}
            title="Resumo"
          />

          <FormPreviewShell
            sections={["Article I", "Article II", "Article III"]}
            subtitle="State of Florida · Division of Corporations"
            title="Articles of Organization"
          />
        </div>
        <StepNavigation
          backDisabled={false}
          backLabel="Voltar"
          nextDisabled={!isAddressComplete}
          nextLabel={isAddressComplete ? "Continuar" : "Preencher endereço"}
          onBack={onBackToMemberData}
          onNext={onContinueToRegisteredAgent}
        />
      </StepCard>
    );
  }

  if (activeStep === "member_count") {
    const isSingleMember = memberCount === 1;

    return (
      <StepCard
        badge="Rascunho local"
        eyebrow="Passo 4 · Sócios"
        title="Quantos sócios terá a LLC?"
      >
        <div className="grid gap-3">
          <StatusMessage
            title={isSingleMember ? "Single-Member LLC" : "Multi-Member LLC"}
            tone={isSingleMember ? "info" : "warning"}
          >
            <p>
              {isSingleMember
                ? "A LLC terá apenas um sócio neste rascunho local."
                : "Informe os dados e percentuais de participação de cada sócio na próxima etapa."}
            </p>
          </StatusMessage>

          <FieldGroup title="Número de sócios">
            <div className="flex items-center justify-center gap-4 rounded-md border bg-card p-5">
              <button
                aria-label="Diminuir número de sócios"
                className="flex size-10 items-center justify-center rounded-md border bg-background text-xl font-semibold disabled:opacity-40"
                disabled={memberCount <= 1}
                onClick={() => onChangeMemberCount(Math.max(1, memberCount - 1))}
                type="button"
              >
                -
              </button>
              <div className="min-w-24 text-center">
                <p className="text-4xl font-semibold text-foreground">
                  {memberCount}
                </p>
                <p className="mt-1 text-xs font-medium text-muted-foreground">
                  {isSingleMember ? "sócio" : "sócios"}
                </p>
              </div>
              <button
                aria-label="Aumentar número de sócios"
                className="flex size-10 items-center justify-center rounded-md border bg-background text-xl font-semibold disabled:opacity-40"
                disabled={memberCount >= 10}
                onClick={() => onChangeMemberCount(Math.min(10, memberCount + 1))}
                type="button"
              >
                +
              </button>
            </div>
          </FieldGroup>

          <ReviewSummary
            items={[
              { label: "Serviço", value: selectedLabel ?? "Pendente" },
              { label: "Nome", value: trimmedLlcName },
              {
                label: "Atividade",
                value: selectedActivityLabel || "Pendente",
              },
              {
                label: "Estrutura",
                value: isSingleMember ? "Single-Member LLC" : "Multi-Member LLC",
              },
            ]}
            title="Resumo"
          />

          <FormPreviewShell
            sections={["Article I", "Article II", "Article III"]}
            subtitle="State of Florida · Division of Corporations"
            title="Articles of Organization"
          />
        </div>
        <StepNavigation
          backDisabled={false}
          backLabel="Voltar"
          nextDisabled={false}
          nextLabel="Continuar"
          onBack={onBackToBusinessActivity}
          onNext={onContinueToMemberData}
        />
      </StepCard>
    );
  }

  if (activeStep === "business_activity") {
    return (
      <StepCard
        badge="Rascunho local"
        eyebrow="Passo 3 · Atividade"
        title="Qual é o ramo do negócio?"
      >
        <div className="grid gap-3">
          <StatusMessage
            title={selectedActivityLabel ? "Atividade selecionada" : "Seleção pendente"}
            tone={selectedActivityLabel ? "success" : "info"}
          >
            <p>
              {selectedActivityLabel
                ? "A atividade foi capturada localmente para uso nas próximas etapas."
                : "Selecione uma categoria ou informe outra atividade para continuar depois."}
            </p>
          </StatusMessage>

          <FieldGroup title="Atividade principal">
            <div className="grid gap-3 sm:grid-cols-2">
              {businessActivityOptions.map((activity) => {
                const selected = activity.id === businessActivity;

                return (
                  <button
                    aria-pressed={selected}
                    className={cn(
                      "rounded-md border bg-card p-3 text-left text-sm font-medium transition-colors",
                      "focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/40",
                      selected
                        ? "border-emerald-600 bg-emerald-50 text-emerald-950"
                        : "text-foreground hover:border-emerald-300 hover:bg-emerald-50/40",
                    )}
                    key={activity.id}
                    onClick={() => onChangeBusinessActivity(activity.id)}
                    type="button"
                  >
                    {activity.label}
                  </button>
                );
              })}
            </div>

            {businessActivity === "other" ? (
              <FieldShell
                hint="Use uma descrição curta da atividade principal."
                label="Descreva a atividade"
              >
                <Input
                  onChange={(event) =>
                    onChangeCustomBusinessActivity(event.target.value)
                  }
                  placeholder="Ex.: Desenvolvimento de aplicativos mobile"
                  value={customBusinessActivity}
                />
              </FieldShell>
            ) : null}
          </FieldGroup>

          <ReviewSummary
            items={[
              { label: "Serviço", value: selectedLabel ?? "Pendente" },
              { label: "Nome", value: trimmedLlcName },
              { label: "Estado", value: "Florida" },
              {
                label: "Atividade",
                value: selectedActivityLabel || "Pendente",
              },
            ]}
            title="Resumo"
          />

          <FormPreviewShell
            sections={["Article I", "Article II", "Article III"]}
            subtitle="State of Florida · Division of Corporations"
            title="Articles of Organization"
          />
        </div>
        <StepNavigation
          backDisabled={false}
          backLabel="Voltar"
          nextDisabled={!selectedActivityLabel}
          nextLabel={selectedActivityLabel ? "Continuar" : "Selecionar atividade"}
          onBack={onBackToLlcName}
          onNext={onContinueToMemberCount}
        />
      </StepCard>
    );
  }

  if (selectedService) {
    return (
      <StepCard
        badge="Rascunho local"
        eyebrow="Passo 2 · Empresa"
        title="Qual será o nome da LLC?"
      >
        <div className="grid gap-3">
          <StatusMessage
            title={
              hasValidSuffix
                ? "Nome compatível"
                : hasLlcName
                  ? "Sufixo obrigatório"
                  : "Nome pendente"
            }
            tone={hasValidSuffix ? "success" : hasLlcName ? "warning" : "info"}
          >
            <p>
              {hasValidSuffix
                ? "O nome informado contém um sufixo compatível com LLC."
                : hasLlcName
                  ? "Inclua um sufixo como LLC, L.L.C. ou Limited Liability Company."
                  : "Informe o nome desejado para continuar a validação local."}
            </p>
          </StatusMessage>

          <FieldGroup title="Nome da empresa">
            <FieldShell
              hint="Validação local somente para estrutura do nome; disponibilidade oficial não é consultada neste passo."
              label="Nome legal desejado"
            >
              <Input
                aria-invalid={hasLlcName && !hasValidSuffix}
                onChange={(event) => onChangeLlcName(event.target.value)}
                placeholder="Ex.: Minha Empresa LLC"
                value={llcName}
              />
            </FieldShell>
          </FieldGroup>

          <ReviewSummary
            items={[
              { label: "Serviço", value: selectedLabel ?? "Pendente" },
              { label: "Estado", value: "Florida" },
              { label: "Tipo", value: "LLC" },
              {
                label: "Nome",
                value: hasLlcName ? trimmedLlcName : "Pendente",
              },
              {
                label: "Validação",
                value: hasValidSuffix ? "Sufixo compatível" : "Pendente",
              },
            ]}
            title="Resumo"
          />

          <FormPreviewShell
            sections={["Article I", "Article II", "Article III"]}
            subtitle="State of Florida · Division of Corporations"
            title="Articles of Organization"
          />
        </div>
        <StepNavigation
          backDisabled={false}
          backLabel="Voltar"
          nextDisabled={!hasValidSuffix}
          nextLabel={hasValidSuffix ? "Continuar" : "Validar nome"}
          onNext={onContinueToBusinessActivity}
          onBack={onResetService}
        />
      </StepCard>
    );
  }

  return (
    <StepCard
      badge="Fluxo guiado"
      eyebrow="Passo 1 · Serviço"
      title="O que você precisa?"
    >
      <div className="grid gap-3">
        <StatusMessage
          title="Seleção pendente"
          tone="info"
        >
          <p>Escolha um serviço para iniciar o fluxo guiado.</p>
        </StatusMessage>
        <ServiceSelection
          onSelect={onSelectService}
          selectedService={selectedService}
        />
        <FieldGroup title="Próxima etapa">
          <FieldShell hint="Será habilitado no próximo slice" label="Empresa">
            <div className="h-10 rounded-md border bg-card" />
          </FieldShell>
        </FieldGroup>
        <ReviewSummary
          items={[
            { label: "Serviço", value: selectedLabel ?? "Pendente" },
            { label: "Estado", value: "Florida" },
            { label: "Tipo", value: "LLC" },
            {
              label: "Status",
              value: "Aguardando seleção",
            },
          ]}
          title="Resumo"
        />
        <FormPreviewShell
          sections={["Article I", "Article II", "Article III"]}
          subtitle="State of Florida · Division of Corporations"
          title="Articles of Organization"
        />
      </div>
      <StepNavigation
        backLabel="Voltar"
        nextLabel="Selecionar serviço"
      />
    </StepCard>
  );
}

export function GuidedIntakeShell() {
  const [selectedService, setSelectedService] = useState<ServiceId | null>(null);
  const [llcName, setLlcName] = useState("");
  const [activeStep, setActiveStep] = useState<FlowStep>("service");
  const [businessActivity, setBusinessActivity] =
    useState<BusinessActivityId | null>(null);
  const [customBusinessActivity, setCustomBusinessActivity] = useState("");
  const [memberCount, setMemberCount] = useState(1);
  const [memberData, setMemberData] = useState<MemberDraft[]>([
    { fullName: "", address: "", ownershipPercentage: "100" },
  ]);
  const [businessAddress, setBusinessAddress] = useState<BusinessAddressDraft>({
    street: "",
    city: "",
    state: "FL",
    zip: "",
  });
  const [registeredAgent, setRegisteredAgent] = useState<RegisteredAgentDraft>({
    choice: null,
    name: "",
    address: "",
    city: "",
    state: "FL",
    zip: "",
  });
  const [einQuestions, setEinQuestions] = useState<EinQuestionsDraft>({
    reasonForApplying: null,
    entityType: null,
    responsiblePartyName: "",
    responsiblePartyPassportNumber: "",
    startDate: "",
    fiscalClosingMonth: "",
  });
  const [documents, setDocuments] = useState<DocumentCollectionDraft>(
    emptyDocumentCollection,
  );
  const currentStep =
    activeStep === "review"
      ? 10
      : activeStep === "documents"
      ? 9
      : activeStep === "ein_questions"
      ? 8
      : activeStep === "registered_agent"
      ? 7
      : activeStep === "business_address"
      ? 6
      : activeStep === "member_data"
      ? 5
      : activeStep === "member_count"
      ? 4
      : activeStep === "business_activity"
        ? 3
        : selectedService
          ? 2
          : 1;
  const currentLabel =
    activeStep === "review"
      ? "Revisão"
      : activeStep === "documents"
      ? "Documentos"
      : activeStep === "ein_questions"
      ? "EIN / SS-4"
      : activeStep === "registered_agent"
      ? "Registered Agent"
      : activeStep === "business_address"
      ? "Endereço"
      : activeStep === "member_data"
      ? "Dados dos sócios"
      : activeStep === "member_count"
      ? "Sócios"
      : activeStep === "business_activity"
      ? "Atividade"
      : selectedService
        ? "Empresa"
        : "Serviço";

  function handleSelectService(service: ServiceId) {
    setSelectedService(service);
    setActiveStep("llc_name");
  }

  function handleResetService() {
    setSelectedService(null);
    setActiveStep("service");
    setLlcName("");
    setBusinessActivity(null);
    setCustomBusinessActivity("");
    setMemberCount(1);
    setMemberData([{ fullName: "", address: "", ownershipPercentage: "100" }]);
    setBusinessAddress({ street: "", city: "", state: "FL", zip: "" });
    setRegisteredAgent({ choice: null, name: "", address: "", city: "", state: "FL", zip: "" });
    setEinQuestions({
      reasonForApplying: null,
      entityType: null,
      responsiblePartyName: "",
      responsiblePartyPassportNumber: "",
      startDate: "",
      fiscalClosingMonth: "",
    });
    setDocuments(emptyDocumentCollection);
  }

  function handleChangeMemberCount(count: number) {
    const equalShare = String(Math.round(100 / count));
    setMemberCount(count);
    setMemberData((currentMembers) =>
      Array.from({ length: count }, (_, index) => {
        const existing = currentMembers[index];
        return existing
          ? { ...existing, ownershipPercentage: equalShare }
          : { fullName: "", address: "", ownershipPercentage: equalShare };
      }),
    );
  }

  function handleChangeMemberData(
    index: number,
    field: keyof MemberDraft,
    value: string,
  ) {
    setMemberData((currentMembers) =>
      Array.from({ length: memberCount }, (_, memberIndex) => {
        const existing = currentMembers[memberIndex] ?? {
          fullName: "",
          address: "",
          ownershipPercentage: String(Math.round(100 / memberCount)),
        };

        if (memberIndex !== index) {
          return existing;
        }

        return { ...existing, [field]: value };
      }),
    );
  }

  function handleChangeBusinessAddress(
    field: keyof BusinessAddressDraft,
    value: string,
  ) {
    setBusinessAddress((current) => ({ ...current, [field]: value }));
  }

  function handleChangeRegisteredAgent(
    field: keyof RegisteredAgentDraft,
    value: string,
  ) {
    setRegisteredAgent((current) => ({ ...current, [field]: value }));
  }

  function handleChangeEinQuestions(
    field: keyof EinQuestionsDraft,
    value: string,
  ) {
    setEinQuestions((current) => ({ ...current, [field]: value }));
  }

  function handleChangeDocumentFile(kind: DocumentKind, file: File | null) {
    setDocuments((current) => ({
      ...current,
      [kind]: file
        ? {
            name: file.name,
            size: file.size,
            type: file.type,
          }
        : null,
    }));
  }

  function handleChangeDocumentExtraction(
    field: keyof DocumentExtractionDraft,
    value: string,
  ) {
    setDocuments((current) => ({
      ...current,
      extraction: {
        ...current.extraction,
        [field]: value,
      },
    }));
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <ProgressHeader
        currentStep={currentStep}
        label={currentLabel}
        totalSteps={11}
      />
      <main className="mx-auto flex w-full max-w-6xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid w-full gap-6 lg:grid-cols-[minmax(0,1fr)_18rem]">
          <StepFrame
            activeStep={activeStep}
            businessActivity={businessActivity}
            businessAddress={businessAddress}
            customBusinessActivity={customBusinessActivity}
            documents={documents}
            einQuestions={einQuestions}
            llcName={llcName}
            memberCount={memberCount}
            memberData={memberData}
            registeredAgent={registeredAgent}
            onBackToBusinessActivity={() => setActiveStep("business_activity")}
            onBackToBusinessAddress={() => setActiveStep("business_address")}
            onBackToMemberCount={() => setActiveStep("member_count")}
            onBackToLlcName={() => setActiveStep("llc_name")}
            onBackToMemberData={() => setActiveStep("member_data")}
            onBackToRegisteredAgent={() => setActiveStep("registered_agent")}
            onBackToDocuments={() => setActiveStep("documents")}
            onBackFromDocuments={() =>
              setActiveStep(
                selectedService === "complete" ? "ein_questions" : "registered_agent",
              )
            }
            onChangeBusinessActivity={setBusinessActivity}
            onChangeBusinessAddress={handleChangeBusinessAddress}
            onChangeCustomBusinessActivity={setCustomBusinessActivity}
            onChangeDocumentExtraction={handleChangeDocumentExtraction}
            onChangeDocumentFile={handleChangeDocumentFile}
            onChangeEinQuestions={handleChangeEinQuestions}
            onChangeLlcName={setLlcName}
            onChangeMemberData={handleChangeMemberData}
            onChangeMemberCount={handleChangeMemberCount}
            onChangeRegisteredAgent={handleChangeRegisteredAgent}
            onContinueToBusinessActivity={() => setActiveStep("business_activity")}
            onContinueToBusinessAddress={() => setActiveStep("business_address")}
            onContinueToDocuments={() => setActiveStep("documents")}
            onContinueToEinQuestions={() => setActiveStep("ein_questions")}
            onContinueToReview={() => setActiveStep("review")}
            onContinueToMemberData={() => setActiveStep("member_data")}
            onContinueToMemberCount={() => setActiveStep("member_count")}
            onContinueToRegisteredAgent={() => setActiveStep("registered_agent")}
            onResetService={handleResetService}
            onSelectService={handleSelectService}
            selectedService={selectedService}
          />

          <aside className="h-fit rounded-lg border bg-card p-5 shadow-sm">
            <p className="text-sm font-semibold text-card-foreground">
              Progresso do pedido
            </p>
            <div className="mt-4 space-y-3">
              {progressItems.map((item, index) => {
                const active = index < currentStep;

                return (
                  <div
                    className={cn(
                      "flex items-center gap-3 text-sm",
                      active ? "text-foreground" : "text-muted-foreground",
                    )}
                    key={item}
                  >
                    <span
                      className={cn(
                        "size-2 rounded-full",
                        active ? "bg-emerald-600" : "bg-border",
                      )}
                    />
                    <span>{item}</span>
                  </div>
                );
              })}
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
