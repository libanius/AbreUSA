import type {
  DocumentFiles,
  PersistOrderPayload,
  PersistOrderResult,
} from "@/lib/order-persistence-types";

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
    throw new Error("Order persistence failed.");
  }

  return (await response.json()) as PersistOrderResult;
}
