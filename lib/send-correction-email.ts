import { resend } from "@/lib/resend";

const FROM = "noreply@notifications.brightscalegroup.com";
const DASHBOARD_URL = "https://abre-usa.vercel.app/dashboard";

export async function sendCorrectionEmail(params: {
  to: string;
  applicantName: string;
  protocolNumber: string;
  llcName: string;
  correctionNotes: string | null;
}): Promise<void> {
  if (!resend) {
    console.info("[email] RESEND_API_KEY not configured — skipping correction email.");
    return;
  }

  const notesSection = params.correctionNotes
    ? [
        "Mensagem da equipe AbreUSA:",
        "",
        params.correctionNotes,
        "",
      ]
    : [
        "Nossa equipe identificou informacoes que precisam de revisao.",
        "Acesse seu dashboard para ver os detalhes e enviar a correcao.",
        "",
      ];

  const lines = [
    `Ola, ${params.applicantName},`,
    "",
    `Seu pedido ${params.protocolNumber} (${params.llcName}) precisa de uma correcao antes de prosseguir.`,
    "",
    ...notesSection,
    `Acesse seu dashboard para revisar e enviar a correcao:`,
    DASHBOARD_URL,
    "",
    "Apos enviar a correcao, sua solicitacao voltara automaticamente para revisao interna.",
    "",
    "Equipe AbreUSA",
  ];

  try {
    await resend.emails.send({
      from: FROM,
      to: params.to,
      subject: `Acao necessaria: revise seus dados — ${params.protocolNumber}`,
      text: lines.join("\n"),
    });
    console.info(`[email] Correction email sent to ${params.to} for order ${params.protocolNumber}`);
  } catch (error) {
    console.error("[email] Failed to send correction email:", error);
  }
}
