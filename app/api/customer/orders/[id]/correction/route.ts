import { createSupabaseRouteHandlerClient } from "@/lib/supabase-ssr";
import { sendAdminCorrectionNotification } from "@/lib/send-status-email";
import { getSupabaseServerClient } from "@/lib/supabase-server";

export const runtime = "nodejs";

type CorrectionBody = {
  applicant?: {
    phone?: string;
    residential_street?: string;
    residential_city?: string;
    residential_state?: string;
    residential_zip?: string;
  };
  llc?: {
    legal_name?: string;
    business_activity_label?: string;
    principal_street?: string;
    principal_city?: string;
    principal_state?: string;
    principal_zip?: string;
  };
};

function trim(value: unknown): string | undefined {
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const authClient = await createSupabaseRouteHandlerClient();
  const {
    data: { user },
  } = await authClient.auth.getUser();

  if (!user?.email) {
    return Response.json({ error: "Unauthorized." }, { status: 401 });
  }

  const { id } = await params;
  const supabase = getSupabaseServerClient();

  // Fetch order — verify it exists and is in customer_reviewing status
  const { data: order, error: orderError } = await (supabase as ReturnType<typeof getSupabaseServerClient>)
    .from("orders")
    .select("id, status, applicants(id, email)")
    .eq("id", id)
    .single();

  if (orderError || !order) {
    return Response.json({ error: "Order not found." }, { status: 404 });
  }

  const orderRow = order as unknown as Record<string, unknown>;

  if (orderRow.status !== "customer_reviewing") {
    return Response.json(
      { error: "Order is not open for correction." },
      { status: 409 },
    );
  }

  // Verify ownership by applicant email
  const applicants = Array.isArray(orderRow.applicants) ? orderRow.applicants : [];
  const applicant = applicants[0] as Record<string, unknown> | undefined;
  const applicantEmail =
    typeof applicant?.email === "string" ? applicant.email.trim().toLowerCase() : null;

  if (!applicantEmail || applicantEmail !== user.email.trim().toLowerCase()) {
    return Response.json({ error: "Forbidden." }, { status: 403 });
  }

  const body = (await request.json()) as CorrectionBody;
  const now = new Date().toISOString();

  // Update applicant fields if provided
  if (body.applicant && applicant?.id) {
    const a = body.applicant;
    const applicantUpdate: {
      phone?: string;
      residential_street?: string | null;
      residential_city?: string | null;
      residential_state?: string | null;
      residential_zip?: string | null;
    } = {};
    if (trim(a.phone)) applicantUpdate.phone = trim(a.phone);
    if (trim(a.residential_street)) applicantUpdate.residential_street = trim(a.residential_street);
    if (trim(a.residential_city)) applicantUpdate.residential_city = trim(a.residential_city);
    if (trim(a.residential_state)) applicantUpdate.residential_state = trim(a.residential_state);
    if (trim(a.residential_zip)) applicantUpdate.residential_zip = trim(a.residential_zip);

    if (Object.keys(applicantUpdate).length > 0) {
      const { error } = await (supabase as ReturnType<typeof getSupabaseServerClient>)
        .from("applicants")
        .update(applicantUpdate)
        .eq("id", applicant.id as string);
      if (error) {
        return Response.json({ error: "Failed to update applicant data." }, { status: 500 });
      }
    }
  }

  // Update LLC fields if provided
  if (body.llc) {
    const l = body.llc;
    const llcUpdate: {
      legal_name?: string;
      business_activity_label?: string;
      principal_street?: string;
      principal_city?: string;
      principal_state?: string;
      principal_zip?: string;
    } = {};
    if (trim(l.legal_name)) llcUpdate.legal_name = trim(l.legal_name);
    if (trim(l.business_activity_label)) llcUpdate.business_activity_label = trim(l.business_activity_label);
    if (trim(l.principal_street)) llcUpdate.principal_street = trim(l.principal_street);
    if (trim(l.principal_city)) llcUpdate.principal_city = trim(l.principal_city);
    if (trim(l.principal_state)) llcUpdate.principal_state = trim(l.principal_state);
    if (trim(l.principal_zip)) llcUpdate.principal_zip = trim(l.principal_zip);

    if (Object.keys(llcUpdate).length > 0) {
      const { error } = await (supabase as ReturnType<typeof getSupabaseServerClient>)
        .from("llcs")
        .update(llcUpdate)
        .eq("order_id", id);
      if (error) {
        return Response.json({ error: "Failed to update LLC data." }, { status: 500 });
      }
    }
  }

  // Move order back to ready_for_review
  await (supabase as ReturnType<typeof getSupabaseServerClient>)
    .from("orders")
    .update({ status: "ready_for_review", updated_at: now })
    .eq("id", id);

  // Audit event
  await (supabase as ReturnType<typeof getSupabaseServerClient>).from("audit_events").insert({
    order_id: id,
    actor_id: user.id,
    actor_email: user.email,
    actor_type: "customer",
    event_type: "customer_correction_submitted",
    event_source: "customer_dashboard",
    result: "success",
    reason: "Customer submitted correction via dashboard",
    metadata: { corrected_fields: { applicant: body.applicant ?? null, llc: body.llc ?? null } },
  });

  // Notify admin — fire and forget
  const orderForEmail = orderRow as Record<string, unknown>;
  void (async () => {
    try {
      const { data: emailData } = await supabase
        .from("orders")
        .select("protocol_number, llcs(legal_name), applicants(name)")
        .eq("id", id)
        .single();
      const emailRow = emailData as Record<string, unknown> | null;
      const protocolNumber =
        typeof emailRow?.protocol_number === "string" ? emailRow.protocol_number : id;
      const llcs = Array.isArray(emailRow?.llcs) ? emailRow?.llcs : [];
      const llcName =
        typeof (llcs[0] as Record<string, unknown>)?.legal_name === "string"
          ? (llcs[0] as Record<string, unknown>).legal_name as string
          : "LLC";
      const applicantsArr = Array.isArray(emailRow?.applicants) ? emailRow?.applicants : [];
      const applicantName =
        typeof (applicantsArr[0] as Record<string, unknown>)?.name === "string"
          ? (applicantsArr[0] as Record<string, unknown>).name as string
          : "Cliente";
      await sendAdminCorrectionNotification({
        protocolNumber,
        llcName,
        applicantName,
        eventType: "correction_submitted",
      });
    } catch (err) {
      console.error("[correction] Admin notification failed:", err);
    }
  })();

  return Response.json({ ok: true });
}
