import { resend } from "@/lib/resend";

const FROM = "noreply@notifications.brightscalegroup.com";
// Decision Needed: migrate to an AbreUSA domain email once the domain is
// verified in Resend (e.g. noreply@abreusa.com).

const SERVICE_LABELS: Record<string, string> = {
  complete_llc_ein: "Complete Package (LLC + EIN)",
  florida_llc: "Florida LLC Formation",
};

export async function sendConfirmationEmail(params: {
  to: string;
  applicantName: string;
  protocolNumber: string;
  serviceType: string;
}): Promise<void> {
  if (!resend) {
    console.info(
      "[email] RESEND_API_KEY not configured — skipping confirmation email.",
    );
    return;
  }

  const serviceLabel = SERVICE_LABELS[params.serviceType] ?? params.serviceType;

  try {
    await resend.emails.send({
      from: FROM,
      to: params.to,
      subject: `Your AbreUSA order is confirmed — ${params.protocolNumber}`,
      text: [
        `Hello ${params.applicantName},`,
        "",
        `Your AbreUSA order has been received and is under review.`,
        "",
        `Protocol number: ${params.protocolNumber}`,
        `Service: ${serviceLabel}`,
        "",
        `Our team will review your documents and contact you with next steps.`,
        `If you have questions, reply to this email.`,
        "",
        `Thank you,`,
        `The AbreUSA Team`,
      ].join("\n"),
    });
  } catch (error) {
    console.error("[email] Failed to send confirmation email:", error);
  }
}
