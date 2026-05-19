import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase-server";

export const runtime = "nodejs";
export const maxDuration = 60;

const MAX_BATCH = 20;

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const supabase = getSupabaseServerClient();
  const now = new Date().toISOString();

  // Fetch eligible documents (up to MAX_BATCH per run)
  const { data: docs, error: fetchError } = await supabase
    .from("documents")
    .select("id, order_id, storage_path, retention_eligible_at, retention_category")
    .eq("retention_category", "sensitive_upload")
    .lte("retention_eligible_at", now)
    .neq("deletion_status", "success")
    .neq("retention_status", "deleted")
    .not("storage_path", "is", null)
    .limit(MAX_BATCH);

  if (fetchError) {
    console.error("[cron/delete] Failed to fetch eligible documents:", fetchError.message);
    return NextResponse.json({ error: fetchError.message }, { status: 500 });
  }

  const eligible = (docs ?? []) as Array<Record<string, unknown>>;
  console.log(`[cron/delete] Found ${eligible.length} eligible document(s).`);

  const results = { deleted: 0, failed: 0, errors: [] as string[] };

  for (const doc of eligible) {
    const docId = doc.id as string;
    const orderId = doc.order_id as string;
    const storagePath = doc.storage_path as string;

    try {
      // Audit: attempt
      const { data: attemptAudit } = await supabase
        .from("audit_events")
        .insert({
          order_id: orderId,
          document_id: docId,
          actor_id: null,
          actor_email: null,
          actor_type: "system",
          event_type: "document_deletion_attempted",
          event_source: "cron_retention",
          result: "success",
          reason: "Automatic retention policy — 90-day sensitive upload window expired",
          metadata: {
            storage_path: storagePath,
            retention_eligible_at: doc.retention_eligible_at,
          },
        })
        .select("id")
        .single();

      const attemptAuditId = (attemptAudit as Record<string, unknown> | null)?.id as string | undefined;

      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from("documents")
        .remove([storagePath]);

      const deletedAt = new Date().toISOString();

      if (storageError) {
        await supabase.from("documents").update({ deletion_status: "failed" }).eq("id", docId);
        await supabase.from("audit_events").insert({
          order_id: orderId,
          document_id: docId,
          actor_id: null,
          actor_email: null,
          actor_type: "system",
          event_type: "document_deletion_failed",
          event_source: "cron_retention",
          result: "failed",
          reason: "Storage deletion failed",
          metadata: { storage_path: storagePath, attempt_audit_id: attemptAuditId },
          error_message: storageError.message,
        });
        results.failed++;
        results.errors.push(`${docId}: ${storageError.message}`);
        console.error(`[cron/delete] Failed to delete ${docId}: ${storageError.message}`);
        continue;
      }

      // Success: update document record
      await supabase.from("documents").update({
        retention_status: "deleted",
        deletion_status: "success",
        deleted_at: deletedAt,
        deleted_by: "cron_retention",
        deletion_reason: "Retention policy \u2014 sensitive upload eligible for deletion",
        deletion_audit_id: attemptAuditId,
      }).eq("id", docId);

      await supabase.from("audit_events").insert({
        order_id: orderId,
        document_id: docId,
        actor_id: null,
        actor_email: null,
        actor_type: "system",
        event_type: "document_deleted",
        event_source: "cron_retention",
        result: "success",
        reason: "Retention policy \u2014 sensitive upload eligible for deletion",
        metadata: {
          storage_path: storagePath,
          attempt_audit_id: attemptAuditId,
          deleted_at: deletedAt,
        },
      });

      results.deleted++;
      console.log(`[cron/delete] Deleted document ${docId} (${storagePath})`);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      results.failed++;
      results.errors.push(`${docId}: ${msg}`);
      console.error(`[cron/delete] Unexpected error for ${docId}: ${msg}`);
    }
  }

  console.log(`[cron/delete] Run complete. deleted=${results.deleted} failed=${results.failed}`);
  return NextResponse.json({ ok: true, ...results, eligible: eligible.length });
}
