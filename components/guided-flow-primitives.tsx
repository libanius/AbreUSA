import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type StepCardProps = {
  eyebrow: string;
  title: string;
  badge?: string;
  children: ReactNode;
};

export function StepCard({ eyebrow, title, badge, children }: StepCardProps) {
  return (
    <section className="w-full max-w-2xl rounded-lg border bg-card p-6 shadow-sm sm:p-8">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-emerald-600">
            {eyebrow}
          </p>
          <h1 className="mt-2 text-2xl font-semibold tracking-normal text-card-foreground sm:text-3xl">
            {title}
          </h1>
        </div>
        {badge ? (
          <div className="hidden rounded-md border bg-muted px-3 py-2 text-sm font-medium text-muted-foreground sm:block">
            {badge}
          </div>
        ) : null}
      </div>
      {children}
    </section>
  );
}

type StepNavigationProps = {
  backLabel: string;
  nextLabel: string;
};

export function StepNavigation({
  backLabel,
  nextLabel,
}: StepNavigationProps) {
  return (
    <div className="mt-6 flex flex-col-reverse gap-3 border-t pt-5 sm:flex-row sm:items-center sm:justify-between">
      <button
        className="inline-flex h-9 items-center justify-center rounded-lg border bg-background px-4 text-sm font-medium text-muted-foreground"
        disabled
        type="button"
      >
        {backLabel}
      </button>
      <button
        className="inline-flex h-9 items-center justify-center rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground disabled:opacity-60"
        disabled
        type="button"
      >
        {nextLabel}
      </button>
    </div>
  );
}

type StatusMessageProps = {
  title: string;
  children: ReactNode;
  tone?: "info" | "success" | "warning";
};

export function StatusMessage({
  title,
  children,
  tone = "info",
}: StatusMessageProps) {
  return (
    <div
      className={cn(
        "rounded-md border p-4",
        tone === "info" && "border-blue-200 bg-blue-50 text-blue-950",
        tone === "success" && "border-emerald-200 bg-emerald-50 text-emerald-950",
        tone === "warning" && "border-amber-200 bg-amber-50 text-amber-950",
      )}
    >
      <p className="text-sm font-semibold">{title}</p>
      <div className="mt-1 text-sm leading-6 opacity-80">{children}</div>
    </div>
  );
}

type FieldShellProps = {
  label: string;
  hint?: string;
  children: ReactNode;
};

export function FieldShell({ label, hint, children }: FieldShellProps) {
  return (
    <div className="grid gap-2">
      <label className="text-sm font-medium text-foreground">{label}</label>
      {children}
      {hint ? <p className="text-xs text-muted-foreground">{hint}</p> : null}
    </div>
  );
}

type FieldGroupProps = {
  title: string;
  children: ReactNode;
};

export function FieldGroup({ title, children }: FieldGroupProps) {
  return (
    <div className="rounded-md border bg-background p-4">
      <p className="mb-4 text-sm font-semibold text-foreground">{title}</p>
      <div className="grid gap-4">{children}</div>
    </div>
  );
}

type ReviewSummaryProps = {
  title: string;
  items: Array<{
    label: string;
    value: string;
  }>;
};

export function ReviewSummary({ title, items }: ReviewSummaryProps) {
  return (
    <div className="rounded-md border bg-background p-4">
      <p className="mb-3 text-sm font-semibold text-foreground">{title}</p>
      <div className="grid overflow-hidden rounded-md border sm:grid-cols-2">
        {items.map((item) => (
          <div
            className="border-b bg-card p-3 last:border-b-0 sm:border-r sm:even:border-r-0"
            key={item.label}
          >
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              {item.label}
            </p>
            <p className="mt-1 text-sm font-medium text-card-foreground">
              {item.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

type FormPreviewShellProps = {
  title: string;
  subtitle: string;
  sections: string[];
};

export function FormPreviewShell({
  title,
  subtitle,
  sections,
}: FormPreviewShellProps) {
  return (
    <div className="rounded-md border bg-background p-4">
      <div className="rounded-md border bg-card p-4">
        <div className="border-b pb-3 text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-foreground">
            {title}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">{subtitle}</p>
        </div>
        <div className="mt-4 grid gap-3">
          {sections.map((section) => (
            <div className="rounded-md border bg-background p-3" key={section}>
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                {section}
              </p>
              <div className="mt-3 h-3 w-3/4 rounded-full bg-muted" />
              <div className="mt-2 h-3 w-1/2 rounded-full bg-muted" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

type ProtocolStatusShellProps = {
  protocol: string;
  status: string;
  timeline: string;
};

export function ProtocolStatusShell({
  protocol,
  status,
  timeline,
}: ProtocolStatusShellProps) {
  return (
    <div className="rounded-md border bg-background p-4">
      <div className="grid gap-3 sm:grid-cols-[1fr_auto] sm:items-center">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Protocolo
          </p>
          <p className="mt-1 font-mono text-lg font-semibold text-foreground">
            {protocol}
          </p>
        </div>
        <div className="rounded-md border bg-card px-3 py-2 text-sm font-medium text-card-foreground">
          {status}
        </div>
      </div>
      <p className="mt-3 text-sm leading-6 text-muted-foreground">{timeline}</p>
    </div>
  );
}

type ConfirmationShellProps = {
  title: string;
  description: string;
  children: ReactNode;
};

export function ConfirmationShell({
  title,
  description,
  children,
}: ConfirmationShellProps) {
  return (
    <div className="rounded-md border bg-emerald-50 p-4 text-emerald-950">
      <div className="flex gap-3">
        <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-sm font-semibold text-white">
          OK
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold">{title}</p>
          <p className="mt-1 text-sm leading-6 opacity-80">{description}</p>
          <div className="mt-4">{children}</div>
        </div>
      </div>
    </div>
  );
}
