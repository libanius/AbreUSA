import { createSupabaseRouteHandlerClient } from "@/lib/supabase-ssr";
import { getSupabaseServerClient } from "@/lib/supabase-server";

export const runtime = "nodejs";

export async function GET(
  _request: Request,
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

  const { data: doc, error: docError } = await supabase
    .from("documents")
    .select("id, order_id, storage_path, retention_status, deletion_status")
    .eq("id", id)
    .single();

  if (docError || !doc) {
    return Response.json({ error: "Document not found." }, { status: 404 });
  }

  const document = doc as Record<string, unknown>;

  if (document.deletion_status === "success" || document.retention_status === "deleted") {
    return Response.json({ error: "Document has been removed." }, { status: 410 });
  }

  // Verify ownership: document order must belong to authenticated user
  const { data: order, error: orderError } = await supabase
    .from("orders")
    .select("id, applicants(email)")
    .eq("id", document.order_id as string)
    .single();

  if (orderError || !order) {
    return Response.json({ error: "Order not found." }, { status: 404 });
  }

  const orderRow = order as Record<string, unknown>;
  const applicants = Array.isArray(orderRow.applicants) ? orderRow.applicants : [];
  const applicantEmail =
    typeof (applicants[0] as Record<string, unknown>)?.email === "string"
      ? ((applicants[0] as Record<string, unknown>).email as string).trim().toLowerCase()
      : null;

  if (!applicantEmail || applicantEmail !== user.email.trim().toLowerCase()) {
    return Response.json({ error: "Forbidden." }, { status: 403 });
  }

  const storagePath = document.storage_path as string;
  if (!storagePath) {
    return Response.json({ error: "Document has no storage path." }, { status: 500 });
  }

  const { data: signedData, error: signedError } = await supabase.storage
    .from("documents")
    .createSignedUrl(storagePath, 60);

  if (signedError || !signedData?.signedUrl) {
    return Response.json({ error: "Failed to generate download link." }, { status: 500 });
  }

  return Response.json({ signedUrl: signedData.signedUrl });
}
