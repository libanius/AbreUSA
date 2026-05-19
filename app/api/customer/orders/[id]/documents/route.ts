import { createSupabaseRouteHandlerClient } from "@/lib/supabase-ssr";
import { getSupabaseServerClient } from "@/lib/supabase-server";
import { sendAdminCorrectionNotification } from "@/lib/send-status-email";

export const runtime = "nodejs";

const ACCEPTED_TYPES = new Set([
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/gif",
  "image/webp",
  "image/heic",
  "image/heif",
  "application/pdf",
]);

const FIELD_KEYS = ["passport", "addressProof"] as const;
type FieldKey = (typeof FIELD_KEYS)[number];

const DOC_TYPE: Record<FieldKey, string> = {
  passport: "passport",
  addressProof: "address_proof",
};

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const authClient = await createSupabaseRouteHandlerClient();
  const {
    data: { user },
  } = await authClient.auth.getUser();

  if (!user?.email) {
    return Response.json({ error: "Não autorizado." }, { status: 401 });
  }

  const { id: orderId } = await params;
  const supabase = getSupabaseServerClient();

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .select("id, status, applicants(id, email)")
    .eq("id", orderId)
    .single();

  if (orderError || !order) {
    return Response.json({ error: "Pedido não encontrado." }, { status: 404 });
  }

  const orderRow = order as unknown as Record<string, unknown>;

  if (orderRow.status !== "customer_reviewing") {
    return Response.json(
      { error: "Pedido não está aguardando correção." },
      { status: 409 },
    );
  }

  const applicants = Array.isArray(orderRow.applicants)
    ? orderRow.applicants
    : [];
  const applicant = (applicants[0] as Record<string, unknown>) ?? null;
  const applicantEmail =
    typeof applicant?.email === "string"
      ? applicant.email.trim().toLowerCase()
      : null;

  if (!applicantEmail || applicantEmail !== user.email.trim().toLowerCase()) {
    return Response.json({ error: "Acesso negado." }, { status: 403 });
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return Response.json(
      { error: "Formato de requisição inválido." },
      { status: 400 },
    );
  }

  const uploaded: string[] = [];
  const timestamp = Date.now();

  for (const field of FIELD_KEYS) {
    const file = formData.get(field);
    if (!(file instanceof File) || file.size === 0) continue;

    const mime = (file.type || "application/octet-stream").toLowerCase().trim();
    if (!ACCEPTED_TYPES.has(mime)) {
      return Response.json(
        {
          error: `Tipo de arquivo não suportado para ${field}. Use JPG, PNG, PDF ou HEIC.`,
        },
        { status: 422 },
      );
    }

    const ext = file.name.split(".").pop() ?? "bin";
    const storagePath = `${orderId}/${DOC_TYPE[field]}_r${timestamp}.${ext}`;
    const fileBuffer = Buffer.from(await file.arrayBuffer());

    const { error: uploadError } = await supabase.storage
      .from("documents")
      .upload(storagePath, fileBuffer, { contentType: mime, upsert: false });

    if (uploadError) {
      console.error(
        `[customer/documents] Upload failed for ${field}:`,
        uploadError.message,
      );
      return Response.json(
        { error: `Falha no upload de ${field}.` },
        { status: 500 },
      );
    }

    const retentionEligibleAt = new Date(
      Date.now() + 90 * 24 * 60 * 60 * 1000,
    ).toISOString();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error: recordError } = await (supabase.from("documents") as any).insert({
      order_id: orderId,
      document_type: DOC_TYPE[field],
      file_name: file.name,
      mime_type: mime,
      storage_path: storagePath,
      retention_category: "sensitive_upload",
      retention_status: "active",
      deletion_status: "not_applicable",
      retention_eligible_at: retentionEligibleAt,
    });

    if (recordError) {
      console.error(
        `[customer/documents] DB insert failed for ${field}:`,
        recordError.message,
      );
      return Response.json(
        { error: `Falha ao registrar ${field}.` },
        { status: 500 },
      );
    }

    uploaded.push(field);
  }

  if (uploaded.length === 0) {
    return Response.json(
      { error: "Nenhum arquivo enviado." },
      { status: 400 },
    );
  }

  // Audit event
  void supabase.from("audit_events").insert({
    order_id: orderId,
    actor_id: user.id,
    actor_email: user.email,
    actor_type: "customer",
    event_type: "customer_documents_replaced",
    event_source: "customer_portal",
    result: "success",
    metadata: { uploaded_fields: uploaded },
  });

  // Fire-and-forget admin notification
  void (async () => {
    try {
      const { data: orderFull } = await supabase
        .from("orders")
        .select(
          "protocol_number, llcs(legal_name), applicants(name)",
        )
        .eq("id", orderId)
        .single();
      if (orderFull) {
        const row = orderFull as unknown as Record<string, unknown>;
        const llcs = Array.isArray(row.llcs) ? row.llcs : [];
        const apps = Array.isArray(row.applicants) ? row.applicants : [];
        await sendAdminCorrectionNotification({
          protocolNumber: String(row.protocol_number ?? ""),
          llcName: String((llcs[0] as Record<string, unknown>)?.legal_name ?? ""),
          applicantName: String((apps[0] as Record<string, unknown>)?.name ?? ""),
          eventType: "documents_replaced",
        });
      }
    } catch {
      // intentionally silent
    }
  })();

  return Response.json({ ok: true, uploaded });
}
