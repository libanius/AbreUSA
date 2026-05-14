import Link from "next/link";
import { headers } from "next/headers";
import { createSupabaseServerComponentClient } from "@/lib/supabase-ssr";
import { checkCustomerDashboardRateLimit } from "@/lib/customer-dashboard-rate-limit";
import {
  getCustomerDashboardOrder,
  getCustomerDashboardOrdersByEmail,
  type CustomerDashboardOrder,
} from "@/lib/customer-dashboard";
import CustomerLogoutButton from "./_components/logout-button";

export const dynamic = "force-dynamic";

type DashboardSearchParams = {
  protocol?: string;
  email?: string;
};

const STATUS_COLORS: Record<string, string> = {
  draft: "bg-gray-100 text-gray-700",
  awaiting_documents: "bg-yellow-100 text-yellow-800",
  ready_for_review: "bg-blue-100 text-blue-800",
  customer_reviewing: "bg-purple-100 text-purple-800",
  approved: "bg-green-100 text-green-800",
  internal_review: "bg-orange-100 text-orange-800",
  submitted: "bg-teal-100 text-teal-800",
  completed: "bg-green-200 text-green-900",
  blocked: "bg-red-100 text-red-800",
};

function formatDate(value: string | null) {
  if (!value) return "-";
  return new Date(value).toLocaleDateString("pt-BR", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-lg border border-gray-200 bg-white p-5">
      <h2 className="text-base font-semibold text-gray-950">{title}</h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function Field({
  label,
  value,
}: {
  label: string;
  value: string | number | null | undefined;
}) {
  return (
    <div>
      <dt className="text-xs font-semibold uppercase tracking-wide text-gray-500">{label}</dt>
      <dd className="mt-1 text-sm text-gray-950">{value ?? "-"}</dd>
    </div>
  );
}

function LookupForm({
  protocol,
  email,
}: {
  protocol: string;
  email: string;
}) {
  return (
    <form method="GET" className="rounded-lg border border-gray-200 bg-white p-5">
      <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto] md:items-end">
        <div>
          <label htmlFor="protocol" className="text-sm font-semibold text-gray-800">
            Protocolo
          </label>
          <input
            id="protocol"
            name="protocol"
            defaultValue={protocol}
            placeholder="AUS-2026-0000"
            className="mt-2 h-10 w-full rounded-lg border border-gray-300 px-3 text-sm outline-none transition focus:border-green-700 focus:ring-2 focus:ring-green-700/20"
          />
        </div>
        <div>
          <label htmlFor="email" className="text-sm font-semibold text-gray-800">
            E-mail do solicitante
          </label>
          <input
            id="email"
            name="email"
            type="email"
            defaultValue={email}
            placeholder="voce@email.com"
            className="mt-2 h-10 w-full rounded-lg border border-gray-300 px-3 text-sm outline-none transition focus:border-green-700 focus:ring-2 focus:ring-green-700/20"
          />
        </div>
        <button
          type="submit"
          className="h-10 rounded-lg bg-gray-950 px-5 text-sm font-semibold text-white transition hover:bg-gray-800"
        >
          Consultar
        </button>
      </div>
      <p className="mt-3 text-xs leading-5 text-gray-500">
        Use o protocolo recebido apos o envio do pedido e o mesmo e-mail informado no onboarding.
      </p>
    </form>
  );
}

function getClientIp(requestHeaders: Headers) {
  const forwardedFor = requestHeaders.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0]?.trim() || "unknown";
  }
  return requestHeaders.get("x-real-ip") ?? "unknown";
}

function DashboardSummary({ order }: { order: CustomerDashboardOrder }) {
  const statusColor = STATUS_COLORS[order.status] ?? "bg-gray-100 text-gray-700";

  return (
    <div className="space-y-5">
      <section className="rounded-lg border border-gray-200 bg-white p-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-green-700">
              {order.serviceLabel}
            </p>
            <h2 className="mt-2 font-mono text-2xl font-bold text-gray-950">
              {order.protocolNumber}
            </h2>
            <p className="mt-1 text-sm text-gray-600">
              Pedido recebido em {formatDate(order.createdAt)}
            </p>
          </div>
          <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusColor}`}>
            {order.statusLabel}
          </span>
        </div>
      </section>

      <Section title="Resumo do pedido">
        <dl className="grid gap-4 md:grid-cols-3">
          <Field label="Solicitante" value={order.applicantName} />
          <Field label="E-mail" value={order.applicantEmail} />
          <Field label="LLC" value={order.llcName} />
          <Field label="Estado" value={order.llcState} />
          <Field label="Tipo de onboarding" value={order.onboardingEntryLabel} />
          <Field label="Extracao de documentos" value={order.documentExtractionLabel} />
          <Field label="Confianca OCR" value={order.extractionConfidence == null ? "-" : `${order.extractionConfidence}%`} />
          <Field label="Aprovado pelo cliente" value={formatDate(order.approvedAt)} />
        </dl>
      </Section>

      <Section title="Documentos">
        {order.documents.length > 0 ? (
          <div className="divide-y divide-gray-100">
            {order.documents.map((document) => (
              <div
                key={`${document.type}-${document.label}`}
                className="flex flex-wrap items-center justify-between gap-3 py-3 first:pt-0 last:pb-0"
              >
                <div>
                  <p className="text-sm font-medium text-gray-950">{document.label}</p>
                  <p className="mt-1 text-xs text-gray-500">{document.retentionLabel}</p>
                </div>
                <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-800">
                  {document.statusLabel}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-600">Nenhum documento registrado neste pedido.</p>
        )}
        <p className="mt-4 rounded-lg bg-gray-50 p-3 text-xs leading-5 text-gray-600">
          Por seguranca, este dashboard mostra apenas o status dos documentos. Links de visualizacao,
          download, caminhos de storage e arquivos sensiveis ficam restritos ao time autorizado da AbreUSA.
        </p>
      </Section>

      <Section title="Formularios e registros">
        {order.generatedForms.length > 0 ? (
          <div className="space-y-3">
            {order.generatedForms.map((form) => (
              <div
                key={form.type}
                className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-gray-100 px-3 py-3"
              >
                <p className="text-sm font-medium text-gray-950">{form.label}</p>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${form.customerApproved ? "bg-green-50 text-green-800" : "bg-gray-100 text-gray-700"}`}
                >
                  {form.customerApproved ? "Aprovado" : "Em preparacao"}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-600">Os formularios do pedido ainda estao em preparacao.</p>
        )}
      </Section>

      <Section title="Proximos passos">
        <ol className="space-y-3">
          {order.timeline.map((item) => (
            <li key={item.label} className="flex gap-3">
              <span
                className={`mt-0.5 h-5 w-5 rounded-full border text-center text-[11px] leading-5 ${
                  item.state === "done"
                    ? "border-green-700 bg-green-700 text-white"
                    : item.state === "current"
                      ? "border-gray-950 bg-gray-950 text-white"
                      : "border-gray-300 bg-white text-gray-400"
                }`}
              >
                {item.state === "done" ? "OK" : ""}
              </span>
              <div>
                <p className="text-sm font-medium text-gray-950">{item.label}</p>
                <p className="text-xs text-gray-500">
                  {item.state === "current"
                    ? "Etapa atual"
                    : item.state === "done"
                      ? "Concluido"
                      : "Proxima etapa"}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </Section>
    </div>
  );
}

export default async function CustomerDashboardPage({
  searchParams,
}: {
  searchParams: Promise<DashboardSearchParams>;
}) {
  // Check authenticated session first
  const supabaseAuth = await createSupabaseServerComponentClient();
  const {
    data: { user },
  } = await supabaseAuth.auth.getUser();

  // Authenticated path — show all orders for this email
  if (user?.email) {
    const orders = await getCustomerDashboardOrdersByEmail(user.email);

    return (
      <main className="min-h-screen bg-gray-50 px-4 py-6 text-gray-950 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl space-y-5">
          <header className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-green-700">
                AbreUSA
              </p>
              <h1 className="mt-1 text-2xl font-bold text-gray-950">Dashboard do cliente</h1>
              <p className="mt-1 text-sm text-gray-500">{user.email}</p>
            </div>
            <CustomerLogoutButton />
          </header>

          {orders.length === 0 ? (
            <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4 text-sm leading-6 text-yellow-900">
              Nenhum pedido encontrado para este e-mail. Se voce realizou um pedido, confirme se o
              e-mail da conta e o mesmo usado no onboarding ou{" "}
              <Link href="/dashboard" className="font-semibold underline">
                consulte pelo protocolo
              </Link>
              .
            </div>
          ) : (
            <div className="space-y-8">
              {orders.map((order) => (
                <DashboardSummary key={order.protocolNumber} order={order} />
              ))}
            </div>
          )}
        </div>
      </main>
    );
  }

  // Unauthenticated path — show lookup form with rate-limited lookup
  const params = await searchParams;
  const protocol = typeof params.protocol === "string" ? params.protocol.trim() : "";
  const email = typeof params.email === "string" ? params.email.trim() : "";
  const hasLookup = Boolean(protocol && email);
  let rateLimited = false;
  let order: CustomerDashboardOrder | null = null;

  if (hasLookup) {
    const requestHeaders = await headers();
    const rateLimitResult = await checkCustomerDashboardRateLimit({
      ipAddress: getClientIp(requestHeaders),
      protocol,
      email,
    });

    if (rateLimitResult.allowed) {
      order = await getCustomerDashboardOrder({ protocol, email });
    } else {
      rateLimited = true;
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-6 text-gray-950 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl space-y-5">
        <header className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-green-700">
              AbreUSA
            </p>
            <h1 className="mt-1 text-2xl font-bold text-gray-950">Dashboard do cliente</h1>
            <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-600">
              Acompanhe o status do seu pedido com uma consulta simples e segura.
            </p>
          </div>
          <Link
            href="/dashboard/login"
            className="text-sm font-semibold text-green-700 hover:underline"
          >
            Entrar com conta
          </Link>
        </header>

        <LookupForm protocol={protocol} email={email} />

        {rateLimited ? (
          <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4 text-sm leading-6 text-yellow-900">
            Muitas tentativas de consulta foram feitas em pouco tempo. Aguarde alguns minutos e
            tente novamente.
          </div>
        ) : null}

        {hasLookup && !order && !rateLimited ? (
          <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4 text-sm leading-6 text-yellow-900">
            Nao encontramos um pedido com esse protocolo e e-mail. Confira os dados informados ou
            fale com a equipe AbreUSA.
          </div>
        ) : null}

        {order ? <DashboardSummary order={order} /> : null}
      </div>
    </main>
  );
}
