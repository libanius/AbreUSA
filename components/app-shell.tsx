import {
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
        <StatusMessage title="Preparação" tone="info">
          <p>Estrutura base pronta para receber as etapas do fluxo guiado.</p>
        </StatusMessage>
        <div className="rounded-md border bg-background p-4">
          <div className="h-3 w-28 rounded-full bg-muted" />
          <div className="mt-4 h-10 rounded-md border bg-card" />
          <div className="mt-3 h-10 rounded-md border bg-card" />
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="min-h-24 rounded-md border bg-background p-4" />
          <div className="min-h-24 rounded-md border bg-background p-4" />
          <div className="min-h-24 rounded-md border bg-background p-4" />
        </div>
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
