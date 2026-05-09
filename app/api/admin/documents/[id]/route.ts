import { getSupabaseServerClient } from "@/lib/supabase-server";
import { createSupabaseRouteHandlerClient } from "@/lib/supabase-ssr";

export const runtime = "nodejs";

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const authClient = await createSupabaseRouteHandlerClient();
  const { data: { user } } = await authClient.auth.getUser();
  if (!user) {
    return Response.json({ error: "Unauthorized." }, { status: 401 });
  }

  const { id } = await params;
  const supabase = getSupabaseServerClient();

  const { data: doc, error: fetchError } = await (supabase as ReturnType<typeof getSupabaseServerClient>)
    .from("documents")
    .select("id, order_id, retention_category, retention_eligible_at, retention_status, deletion_status, storage_path, file_name")
    .eq("id", id)
    .single();

  if (fetchError || !doc) {
    return Response.json({ error: "Document not found." }, { status: 404 });
  }

  const document = doc as Record<string, unknown>;

  if (document.retention_category !== "sensitive_upload") {
    return Response.json({ error: "Only sensitive_upload documents can be deleted." }, { status: 400 });
  }

  if (document.deletion_status === "success" || document.retention_status === "deleted") {
    return Response.json({ error: "Document has already been deleted." }, { status: 400 });
  }

  if (!document.retention_eligible_at) {
    return Response.json({ error: "Document has no retention eligibility date set." }, { status: 400 });
  }

  if (new Date(document.retention_eligible_at as string) > new Date()) {
    return Response.json({ error: "Document is not yet eligible for deletion." }, { status: 400 });
  }

  const storagePath = document.storage_path as string;
  if (!storagePath) {
    return Response.json({ error: "Document has no storage path." }, { status: 400 });
  }

  // Create attempt audit event BEFORE storage removal
  const { data: attemptAudit, error: attemptAuditError } = await (supabase as ReturnType<typeof getSupabaseServerClient>)
    .from("audit_events")
    .insert({
      order_id: document.order_id as string,
      document_id: id,
      actor_id: user.id,
      actor_email: user.email ?? null,
      actor_type: "admin",
      event_type: "document_deletion_attempted",
      event_source: "admin_portal",
      result: "success",
      reason: "Admin manual deletion",
      metadata: {
        storage_path: storagePath,
        retention_category: document.retention_category,
        retention_eligible_at: document.retention_eligible_at,
      },
    })
    .select("id")
    .single();

  if (attemptAuditError || !attemptAudit) {
    return Response.json({ error: "Failed to create deletion attempt audit event." }, { status: 500 });
  }

  const attemptAuditId = (attemptAudit as Record<string, unknown>).id as string;

  // Delete from private storage
  const { error: storageError } = await supabase.storage
    .from("documents")
    .remove([storagePath]);

  const now = new Date().toISOString();

  if (storageError) {
    await (supabase as ReturnType<typeof getSupabaseServerClient>)
      .from("documents")
      .update({ deletion_status: "failed" })
      .eq("id", id);

    await (supabase as ReturnType<typeof getSupabaseServerClient>)
      .from("audit_events")
      .insert({
        order_id: document.order_id as string,
        document_id: id,
        actor_id: user.id,
        actor_email: user.email ?? null,
        actor_type: "admin",
        event_type: "document_deletion_failed",
        event_source: "admin_portal",
        result: "failed",
        reason: "Storage deletion failed",
        metadata: {
          storage_path: storagePath,
          attempt_audit_id: attemptAuditId,
        },
        error_message: storageError.message,
      });

    return Response.json(
      { error: "Storage deletion failed.", detail: storageError.message },
      { status: 500 },
    );
  }

  // Success: update document metadata
  await (supabase as ReturnType<typeof getSupabaseServerClient>)
    .from("documents")
    .update({
      retention_status: "deleted",
      deletion_status: "success",
      deleted_at: now,
      deleted_by: user.email ?? user.id,
      deletion_reason: "Retention policy \u2014 sensitive upload eligible for deletion",
      deletion_audit_id: attemptAuditId,
    })
    .eq("id", id);

  await (supabase as ReturnType<typeof getSupabaseServerClient>)
    .from("audit_events")
    .insert({
      order_id: document.order_id as string,
      document_id: id,
      actor_id: user.id,
      actor_email: user.email ?? null,
      actor_type: "admin",
      event_type: "document_deleted",
      event_source: "admin_portal",
      result: "success",
      reason: "Retention policy \u2014 sensitive upload eligible for deletion",
      metadata: {
        storage_path: storagePath,
        attempt_audit_id: attemptAuditId,
        deleted_at: now,
      },
    });

  return Response.json({ ok: true });
}
