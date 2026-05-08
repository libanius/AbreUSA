import { getSupabaseServerClient } from "@/lib/supabase-server";
import { createSupabaseRouteHandlerClient } from "@/lib/supabase-ssr";

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
  const body = await request.json() as { status?: string };
  const { status } = body;

  if (!status || !VALID_STATUSES.has(status)) {
    return Response.json({ error: "Invalid status." }, { status: 400 });
  }

  const supabase = getSupabaseServerClient();
  const { error } = await (supabase as ReturnType<typeof getSupabaseServerClient>)
    .from("orders")
    // @ts-ignore
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json({ ok: true });
}
