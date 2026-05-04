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

