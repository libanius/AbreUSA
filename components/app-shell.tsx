import {
  ConfirmationShell,
  FieldGroup,
  FieldShell,
  FormPreviewShell,
  ProtocolStatusShell,
  ReviewSummary,
  StatusMessage,
  StepCard,
  StepNavigation,
} from "@/components/guided-flow-primitives";

type ProgressHeaderProps = {
  currentStep: number;
  totalSteps: number;
  label: string;
};

function ProgressHeader({ currentStep, totalSteps, label }: ProgressHeaderProps) {
  const percent = Math.round((currentStep / totalSteps) * 100);

  return (
    <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur">
      <div className="mx-auto flex min-h-16 w-full max-w-6xl items-center gap-6 px-4 sm:px-6 lg:px-8">
        <div className="flex min-w-28 items-baseline gap-0.5">
          <span className="text-lg font-semibold tracking-normal text-foreground">
            Abre
          </span>
          <span className="text-lg font-semibold tracking-normal text-emerald-600">
            USA
          </span>
        </div>

        <div className="min-w-0 flex-1">
          <div className="mb-2 flex items-center justify-between gap-3">
            <p className="truncate text-sm font-medium text-foreground">
              {label}
            </p>
            <p className="shrink-0 text-xs font-medium text-muted-foreground">
              {currentStep}/{totalSteps}
            </p>
          </div>
          <div
            aria-label={`Progresso: ${percent}%`}
            className="h-2 overflow-hidden rounded-full bg-muted"
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={percent}
          >
            <div
              className="h-full rounded-full bg-emerald-600"
              style={{ width: `${percent}%` }}
            />
          </div>
        </div>
      </div>
    </header>
  );
}

function StepFrame() {
  return (
    <StepCard
      badge="Fluxo guiado"
      eyebrow="Etapa inicial"
      title="Abertura de empresa nos EUA"
    >
      <div className="grid gap-3">
        <StatusMessage title="Dados pendentes" tone="info">
          <p>Revise as informações antes de continuar.</p>
        </StatusMessage>
        <FieldGroup title="Dados principais">
          <FieldShell hint="Obrigatório" label="Nome da empresa">
            <div className="h-10 rounded-md border bg-card" />
          </FieldShell>
          <FieldShell hint="Obrigatório" label="Atividade">
            <div className="h-10 rounded-md border bg-card" />
          </FieldShell>
        </FieldGroup>
        <ReviewSummary
          items={[
            { label: "Serviço", value: "Pacote completo" },
            { label: "Estado", value: "Florida" },
            { label: "Tipo", value: "LLC" },
            { label: "Status", value: "Rascunho" },
          ]}
          title="Resumo"
        />
        <FormPreviewShell
          sections={["Article I", "Article II", "Article III"]}
          subtitle="State of Florida · Division of Corporations"
          title="Articles of Organization"
        />
        <ConfirmationShell
          description="A etapa de aprovação futura usará este espaço para comunicar o status final ao cliente."
          title="Confirmação"
        >
          <ProtocolStatusShell
            protocol="AUS-2026-0000"
            status="Aguardando revisão"
            timeline="Nossa equipe revisará o pedido antes de qualquer submissão oficial."
          />
        </ConfirmationShell>
      </div>
      <StepNavigation backLabel="Voltar" nextLabel="Continuar" />
    </StepCard>
  );
}

export function AppShell() {
  return (
    <div className="min-h-screen bg-muted/30">
      <ProgressHeader currentStep={1} totalSteps={8} label="Preparação" />
      <main className="mx-auto flex w-full max-w-6xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid w-full gap-6 lg:grid-cols-[minmax(0,1fr)_18rem]">
          <StepFrame />

          <aside className="h-fit rounded-lg border bg-card p-5 shadow-sm">
            <p className="text-sm font-semibold text-card-foreground">
              Progresso do pedido
            </p>
            <div className="mt-4 space-y-3">
              {["Serviço", "Empresa", "Documentos", "Revisão"].map((item) => (
                <div
                  className="flex items-center gap-3 text-sm text-muted-foreground"
                  key={item}
                >
                  <span className="size-2 rounded-full bg-border" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
