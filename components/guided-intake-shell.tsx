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
  | "member_data";
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
  "Documentos",
  "Revisão",
  "Envio",
];
const llcSuffixPattern =
  /\b(l\.?\s?l\.?\s?c\.?|limited liability company)\.?$/i;

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
  customBusinessActivity,
  llcName,
  memberCount,
  memberData,
  onBackToBusinessActivity,
  onBackToMemberCount,
  onBackToLlcName,
  onChangeBusinessActivity,
  onChangeCustomBusinessActivity,
  onChangeLlcName,
  onChangeMemberData,
  onChangeMemberCount,
  onContinueToBusinessActivity,
  onContinueToMemberData,
  onContinueToMemberCount,
  onResetService,
  selectedService,
  onSelectService,
}: {
  activeStep: FlowStep;
  businessActivity: BusinessActivityId | null;
  customBusinessActivity: string;
  llcName: string;
  memberCount: number;
  memberData: MemberDraft[];
  onBackToBusinessActivity: () => void;
  onBackToMemberCount: () => void;
  onBackToLlcName: () => void;
  onChangeBusinessActivity: (activity: BusinessActivityId) => void;
  onChangeCustomBusinessActivity: (activity: string) => void;
  onChangeLlcName: (name: string) => void;
  onChangeMemberData: (
    index: number,
    field: keyof MemberDraft,
    value: string,
  ) => void;
  onChangeMemberCount: (count: number) => void;
  onContinueToBusinessActivity: () => void;
  onContinueToMemberData: () => void;
  onContinueToMemberCount: () => void;
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
          nextDisabled
          nextLabel="Continuar"
          onBack={onBackToMemberCount}
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
                : "Cada sócio deverá informar nome completo, endereço e percentual de participação em uma etapa futura."}
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
  const currentStep =
    activeStep === "member_data"
      ? 5
      : activeStep === "member_count"
      ? 4
      : activeStep === "business_activity"
        ? 3
        : selectedService
          ? 2
          : 1;
  const currentLabel =
    activeStep === "member_data"
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
    setBusinessActivity(null);
    setCustomBusinessActivity("");
    setMemberCount(1);
    setMemberData([{ fullName: "", address: "", ownershipPercentage: "100" }]);
  }

  function handleChangeMemberCount(count: number) {
    setMemberCount(count);
    setMemberData((currentMembers) =>
      Array.from({ length: count }, (_, index) => {
        return (
          currentMembers[index] ?? {
            fullName: "",
            address: "",
            ownershipPercentage: String(Math.round(100 / count)),
          }
        );
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

  return (
    <div className="min-h-screen bg-muted/30">
      <ProgressHeader
        currentStep={currentStep}
        label={currentLabel}
        totalSteps={8}
      />
      <main className="mx-auto flex w-full max-w-6xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid w-full gap-6 lg:grid-cols-[minmax(0,1fr)_18rem]">
          <StepFrame
            activeStep={activeStep}
            businessActivity={businessActivity}
            customBusinessActivity={customBusinessActivity}
            llcName={llcName}
            memberCount={memberCount}
            memberData={memberData}
            onBackToBusinessActivity={() => setActiveStep("business_activity")}
            onBackToMemberCount={() => setActiveStep("member_count")}
            onBackToLlcName={() => setActiveStep("llc_name")}
            onChangeBusinessActivity={setBusinessActivity}
            onChangeCustomBusinessActivity={setCustomBusinessActivity}
            onChangeLlcName={setLlcName}
            onChangeMemberData={handleChangeMemberData}
            onChangeMemberCount={handleChangeMemberCount}
            onContinueToBusinessActivity={() => setActiveStep("business_activity")}
            onContinueToMemberData={() => setActiveStep("member_data")}
            onContinueToMemberCount={() => setActiveStep("member_count")}
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
