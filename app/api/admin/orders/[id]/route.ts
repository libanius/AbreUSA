import { getSupabaseServerClient } from "@/lib/supabase-server";
import { createSupabaseRouteHandlerClient } from "@/lib/supabase-ssr";
import { sendCorrectionEmail } from "@/lib/send-correction-email";

export const runtime = "nodejs";

const VALID_STATUSES = new Set([
  "draft",
  "awaiting_documents",
  "ready_for_review",
  "customer_reviewing",
  "approved",
  "internal_review",
  "submitted",
  "completed",
  "blocked",
]);

const RETENTION_TRIGGER_STATUSES = new Set(["completed", "blocked"]);
const RETENTION_WINDOW_DAYS = 90;

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const authClient = await createSupabaseRouteHandlerClient();
  const { data: { user } } = await authClient.auth.getUser();
  if (!user) {
    return Response.json({ error: "Unauthorized." }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json() as { status?: string; correction_notes?: string | null };
  const { status, correction_notes } = body;

  if (!status || !VALID_STATUSES.has(status)) {
    return Response.json({ error: "Invalid status." }, { status: 400 });
  }

  const supabase = getSupabaseServerClient();
  const { data: currentOrder, error: currentOrderError } = await (supabase as ReturnType<typeof getSupabaseServerClient>)
    .from("orders")
    .select("status, protocol_number, applicants(name, email), llcs(legal_name)")
    .eq("id", id)
    .single();

  if (currentOrderError) {
    return Response.json({ error: currentOrderError.message }, { status: 500 });
  }

  const previousStatus = (currentOrder as { status?: string } | null)?.status ?? null;
  const updatedAt = new Date().toISOString();
  const orderUpdate: { status: string; updated_at: string; correction_notes?: string | null } = {
    status,
    updated_at: updatedAt,
  };
  if (status === "customer_reviewing" && correction_notes !== undefined) {
    orderUpdate.correction_notes = correction_notes ?? null;
  }
  // Clear notes when leaving customer_reviewing
  if (status !== "customer_reviewing") {
    orderUpdate.correction_notes = null;
  }

  const { error } = await (supabase as ReturnType<typeof getSupabaseServerClient>)
    .from("orders")
    .update(orderUpdate)
    .eq("id", id);

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  const auditMetadata: Record<string, unknown> = {
    previous_status: previousStatus,
    new_status: status,
  };

  if (RETENTION_TRIGGER_STATUSES.has(status)) {
    const retentionEligibleAt = new Date(
      Date.now() + RETENTION_WINDOW_DAYS * 24 * 60 * 60 * 1000,
    ).toISOString();

    const { error: retentionError } = await (supabase as ReturnType<typeof getSupabaseServerClient>)
      .from("documents")
      .update({
        retention_eligible_at: retentionEligibleAt,
        retention_status: "active",
        deletion_status: "not_applicable",
      })
      .eq("order_id", id)
      .eq("retention_category", "sensitive_upload");

    auditMetadata.retention_eligible_at = retentionEligibleAt;
    auditMetadata.retention_update = retentionError ? "failed" : "scheduled";
    if (retentionError) {
      auditMetadata.retention_error = retentionError.message;
    }
  }

  const { error: auditError } = await (supabase as ReturnType<typeof getSupabaseServerClient>)
    .from("audit_events")
    .insert({
      order_id: id,
      actor_id: user.id,
      actor_email: user.email ?? null,
      actor_type: "admin",
      event_type: "order_status_updated",
      event_source: "admin_portal",
      result: "success",
      reason: "Admin order status update",
      metadata: auditMetadata,
    });

  if (auditError) {
    return Response.json({ error: auditError.message }, { status: 500 });
  }

  // Fire-and-forget notification email when entering customer_reviewing
  if (status === "customer_reviewing" && previousStatus !== "customer_reviewing") {
    const orderRow = currentOrder as unknown as Record<string, unknown>;
    const applicants = Array.isArray(orderRow.applicants) ? orderRow.applicants : [];
    const applicant = (applicants[0] ?? {}) as Record<string, unknown>;
    const llcs = Array.isArray(orderRow.llcs) ? orderRow.llcs : [];
    const llc = (llcs[0] ?? {}) as Record<string, unknown>;

    const applicantEmail = typeof applicant.email === "string" ? applicant.email : null;
    const applicantName = typeof applicant.name === "string" ? applicant.name : "Cliente";
    const protocolNumber = typeof orderRow.protocol_number === "string" ? orderRow.protocol_number : id;
    const llcName = typeof llc.legal_name === "string" ? llc.legal_name : "sua LLC";

    if (applicantEmail) {
      void sendCorrectionEmail({
        to: applicantEmail,
        applicantName,
        protocolNumber,
        llcName,
        correctionNotes: correction_notes ?? null,
      });
    }
  }

  return Response.json({ ok: true });
}
