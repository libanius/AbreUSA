import { persistOrderServer } from "@/lib/persist-order-server";
import type { PersistOrderPayload } from "@/lib/order-persistence-types";
import { sendConfirmationEmail } from "@/lib/send-confirmation-email";

export const runtime = "nodejs";

function isFile(value: FormDataEntryValue | null): value is File {
  return value instanceof File;
}

function parsePayload(value: FormDataEntryValue | null): PersistOrderPayload {
  if (typeof value !== "string") {
    throw new Error("Missing order payload.");
  }

  const payload = JSON.parse(value) as PersistOrderPayload;
  if (!payload.applicant?.email || !payload.order?.serviceType || !payload.llc?.legalName) {
    throw new Error("Invalid order payload.");
  }

  return payload;
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const payload = parsePayload(formData.get("payload"));
    const passport = formData.get("passport");
    const addressProof = formData.get("addressProof");
    const result = await persistOrderServer(payload, {
      passport: isFile(passport) ? passport : null,
      addressProof: isFile(addressProof) ? addressProof : null,
    });

    void sendConfirmationEmail({
      to: payload.applicant.email,
      applicantName: payload.applicant.name,
      protocolNumber: result.protocolNumber,
      serviceType: payload.order.serviceType,
    });

    return Response.json(result);
  } catch (error) {
    console.error("Order persistence failed:", error);
    return Response.json(
      { error: "Order persistence failed." },
      { status: 500 },
    );
  }
}
