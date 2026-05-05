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
  selectedService,
  onSelectService,
}: {
  selectedService: ServiceId | null;
  onSelectService: (service: ServiceId) => void;
}) {
  const selectedLabel = useMemo(() => {
    return serviceOptions.find((service) => service.id === selectedService)
      ?.title;
  }, [selectedService]);

  return (
    <StepCard
      badge={selectedService ? "Serviço selecionado" : "Fluxo guiado"}
      eyebrow="Passo 1 · Serviço"
      title="O que você precisa?"
    >
      <div className="grid gap-3">
        <StatusMessage
          title={selectedService ? "Caminho iniciado" : "Seleção pendente"}
          tone={selectedService ? "success" : "info"}
        >
          <p>
            {selectedService
              ? "O próximo passo será preparado para o caminho selecionado."
              : "Escolha um serviço para iniciar o fluxo guiado."}
          </p>
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
              value: selectedService ? "Iniciado" : "Aguardando seleção",
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
        nextLabel={selectedService ? "Continuar" : "Selecionar serviço"}
      />
    </StepCard>
  );
}

export function GuidedIntakeShell() {
  const [selectedService, setSelectedService] = useState<ServiceId | null>(null);
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
