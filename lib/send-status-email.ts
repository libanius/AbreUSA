import { resend } from "@/lib/resend";

const FROM = "noreply@notifications.brightscalegroup.com";
const DASHBOARD_URL = "https://abre-usa.vercel.app/dashboard";

type StatusEmailParams = {
  to: string;
  applicantName: string;
  protocolNumber: string;
  llcName: string;
};

export async function sendApprovedEmail(params: StatusEmailParams): Promise<void> {
  if (!resend) {
    console.info("[email] RESEND_API_KEY not configured — skipping approved email.");
    return;
  }

  const lines = [
    `Ola, ${params.applicantName},`,
    "",
    `Temos uma otima noticia! Seu pedido ${params.protocolNumber} (${params.llcName}) foi aprovado pela nossa equipe.`,
    "",
    "Agora estamos preparando os documentos para envio ao Estado da Florida.",
    "Voce recebera uma nova atualizacao assim que o pedido for oficialmente submetido.",
    "",
    "Acompanhe o status do seu pedido no dashboard:",
    DASHBOARD_URL,
    "",
    "Equipe AbreUSA",
  ];

  try {
    await resend.emails.send({
      from: FROM,
      to: params.to,
      subject: `Pedido aprovado — ${params.protocolNumber}`,
      text: lines.join("\n"),
    });
    console.info(`[email] Approved email sent to ${params.to} for order ${params.protocolNumber}`);
  } catch (error) {
    console.error("[email] Failed to send approved email:", error);
  }
}

export async function sendSubmittedEmail(params: StatusEmailParams): Promise<void> {
  if (!resend) {
    console.info("[email] RESEND_API_KEY not configured — skipping submitted email.");
    return;
  }

  const lines = [
    `Ola, ${params.applicantName},`,
    "",
    `Seu pedido ${params.protocolNumber} (${params.llcName}) foi oficialmente submetido ao Estado da Florida.`,
    "",
    "O processo de abertura da LLC esta em andamento.",
    "O prazo de aprovacao pelo estado varia, mas normalmente leva alguns dias uteis.",
    "Voce recebera uma nova atualizacao quando o processo for concluido.",
    "",
    "Acompanhe o status do seu pedido no dashboard:",
    DASHBOARD_URL,
    "",
    "Equipe AbreUSA",
  ];

  try {
    await resend.emails.send({
      from: FROM,
      to: params.to,
      subject: `Pedido submetido ao Estado da Florida — ${params.protocolNumber}`,
      text: lines.join("\n"),
    });
    console.info(`[email] Submitted email sent to ${params.to} for order ${params.protocolNumber}`);
  } catch (error) {
    console.error("[email] Failed to send submitted email:", error);
  }
}

export async function sendCompletedEmail(params: StatusEmailParams): Promise<void> {
  if (!resend) {
    console.info("[email] RESEND_API_KEY not configured — skipping completed email.");
    return;
  }

  const lines = [
    `Ola, ${params.applicantName},`,
    "",
    `Parabens! Seu pedido ${params.protocolNumber} foi concluido com sucesso.`,
    "",
    `Sua LLC ${params.llcName} esta oficialmente registrada no Estado da Florida.`,
    "",
    "Acesse seu dashboard para visualizar os documentos gerados e o resumo do seu pedido:",
    DASHBOARD_URL,
    "",
    "Obrigado por confiar na AbreUSA. Foi um prazer ajudar a abrir seu negocio nos Estados Unidos.",
    "",
    "Equipe AbreUSA",
  ];

  try {
    await resend.emails.send({
      from: FROM,
      to: params.to,
      subject: `LLC aberta com sucesso! — ${params.protocolNumber}`,
      text: lines.join("\n"),
    });
    console.info(`[email] Completed email sent to ${params.to} for order ${params.protocolNumber}`);
  } catch (error) {
    console.error("[email] Failed to send completed email:", error);
  }
}
