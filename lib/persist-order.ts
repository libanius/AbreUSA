import type {
  DocumentFiles,
  PersistOrderPayload,
  PersistOrderResult,
} from "@/lib/order-persistence-types";

export class OrderPersistenceError extends Error {
  constructor(
    public readonly code: "payload_too_large" | "request_failed",
    message: string,
  ) {
    super(message);
    this.name = "OrderPersistenceError";
  }
}

export async function persistOrder(
  payload: PersistOrderPayload,
  files?: DocumentFiles,
): Promise<PersistOrderResult> {
  const formData = new FormData();
  formData.append("payload", JSON.stringify(payload));

  if (files?.passport) {
    formData.append("passport", files.passport);
  }
  if (files?.addressProof) {
    formData.append("addressProof", files.addressProof);
  }

  const response = await fetch("/api/orders", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    if (response.status === 413) {
      throw new OrderPersistenceError(
        "payload_too_large",
        "Os documentos ultrapassaram o limite de envio. Volte à etapa de documentos e selecione arquivos menores.",
      );
    }

    let details = "";
    try {
      const body = (await response.json()) as { error?: string };
      details = body.error ? ` ${body.error}` : "";
    } catch {
      details = "";
    }

    throw new OrderPersistenceError(
      "request_failed",
      `Não foi possível salvar o pedido.${details}`,
    );
  }

  return (await response.json()) as PersistOrderResult;
}
