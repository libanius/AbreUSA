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

type ServiceOption = {
  id: ServiceId;
  title: string;
  description: string;
  price: string;
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

const progressItems = ["Serviço", "Empresa", "Documentos", "Revisão"];
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
  llcName,
  onChangeLlcName,
  onResetService,
  selectedService,
  onSelectService,
}: {
  llcName: string;
  onChangeLlcName: (name: string) => void;
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
          nextLabel={hasValidSuffix ? "Continuar" : "Validar nome"}
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
  const currentStep = selectedService ? 2 : 1;
  const currentLabel = selectedService ? "Empresa" : "Serviço";

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
            llcName={llcName}
            onChangeLlcName={setLlcName}
            onResetService={() => setSelectedService(null)}
            onSelectService={setSelectedService}
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
