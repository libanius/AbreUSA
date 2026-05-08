import { notFound } from "next/navigation";
import Link from "next/link";
import { getSupabaseServerClient } from "@/lib/supabase-server";
import StatusUpdater from "./_components/status-updater";

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
      applicants(id, name, email, phone),
      llcs(id, legal_name, state, business_activity_label, principal_street, principal_city, principal_state, principal_zip, management_type, member_count),
      members(id, member_index, full_name, address, ownership_percentage),
      registered_agents(id, choice, name, address, city, state, zip),
      ein_details(id, reason_for_applying, entity_type, responsible_party_name, responsible_party_passport_number, start_date, fiscal_closing_month),
      generated_forms(id, form_type, customer_approved),
      documents(id, document_type, file_name, mime_type, storage_path)
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
          <StatusUpdater orderId={id} currentStatus={order.status as string} />
        </div>
      </div>

      {/* Applicant */}
      {applicant && (
        <Section title="Applicant">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Field label="Name" value={applicant.name as string} />
            <Field label="Email" value={applicant.email as string} />
            <Field label="Phone" value={applicant.phone as string} />
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
            <Field label="Principal Address" value={`${llc.principal_street as string}, ${llc.principal_city as string}, ${llc.principal_state as string} ${llc.principal_zip as string}`} />
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
              <div key={doc.id as string} className="flex items-center justify-between gap-4 py-2 border-b border-gray-100 last:border-0">
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {(doc.document_type as string).replace(/_/g, " ")}
                  </p>
                  <p className="text-xs text-gray-500">{doc.file_name as string}</p>
                </div>
                <div className="flex gap-2 shrink-0">
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
                </div>
              </div>
            ))}
          </div>
        </Section>
      )}
    </div>
  );
}
