import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import fs from "fs";
import path from "path";

export const runtime = "nodejs";

const STEP_LABELS: Record<string, string> = {
  service: "seleção de serviço",
  entry_mode: "modo de entrada de dados",
  applicant_contact: "dados de contato do solicitante",
  llc_name: "nome da LLC",
  business_activity: "atividade comercial",
  member_count: "número de sócios",
  member_data: "dados dos sócios",
  business_address: "endereço comercial da LLC",
  registered_agent: "Registered Agent",
  ein_questions: "informações para o EIN (Form SS-4)",
  documents: "envio de documentos",
  extraction_review: "revisão da extração automática",
  review: "revisão final do pedido",
  approval: "aprovação do pedido",
};

const SERVICE_LABELS: Record<string, string> = {
  complete: "Pacote Completo — LLC + EIN",
  florida_llc: "LLC na Flórida",
};

const BUSINESS_LABELS: Record<string, string> = {
  tech: "Tecnologia / Software",
  ecomm: "E-commerce",
  consulting: "Consultoria",
  import: "Importação / Exportação",
  construction: "Construção",
  food: "Alimentação / Restaurante",
  health: "Saúde / Bem-estar",
  realestate: "Imóveis",
  education: "Educação",
  other: "Outro",
};

const AGENT_LABELS: Record<string, string> = {
  abreusa: "AbreUSA (recomendado)",
  self: "Próprio sócio",
  other: "Outro agente",
};

// Reads the instructions file every request so edits take effect immediately (dev + prod cold start)
function readInstructions(): string {
  const filePath = path.join(process.cwd(), "content", "assistant-instructions.md");
  try {
    return fs.readFileSync(filePath, "utf-8");
  } catch {
    console.warn("[chat-assistant] Instructions file not found at", filePath);
    return "";
  }
}

function buildSystemPrompt(step: string, formContext: Record<string, unknown>): string {
  const instructions = readInstructions();

  const stepLabel = STEP_LABELS[step] ?? step;
  const serviceLabel =
    typeof formContext.service === "string"
      ? (SERVICE_LABELS[formContext.service] ?? formContext.service)
      : "não selecionado";
  const llcName = formContext.llcName || "não definido";
  const memberCount = formContext.memberCount ?? 1;
  const businessActivity =
    typeof formContext.businessActivity === "string"
      ? (BUSINESS_LABELS[formContext.businessActivity] ?? formContext.businessActivity)
      : "não definida";
  const agentChoice =
    typeof formContext.registeredAgentChoice === "string"
      ? (AGENT_LABELS[formContext.registeredAgentChoice] ?? formContext.registeredAgentChoice)
      : "não escolhido";
  const entryMode =
    formContext.entryMode === "document_assisted"
      ? "envio de documentos"
      : formContext.entryMode === "manual"
        ? "preenchimento manual"
        : "não definido";

  return `${instructions}

---

## Contexto Atual do Formulário do Cliente

- Passo atual: ${stepLabel}
- Serviço selecionado: ${serviceLabel}
- Modo de entrada: ${entryMode}
- Nome da LLC: ${llcName}
- Número de sócios: ${memberCount}
- Atividade comercial: ${businessActivity}
- Registered Agent escolhido: ${agentChoice}
- Nome do solicitante: ${formContext.applicantName || "não informado"}
- E-mail do solicitante: ${formContext.applicantEmail || "não informado"}

---

## Formato de Resposta (OBRIGATÓRIO)

Retorne SEMPRE um JSON válido com esta estrutura:

{
  "reply": "sua resposta em português, clara e concisa",
  "suggestions": ["opção curta 1", "opção curta 2", "opção curta 3"],
  "action": {
    "type": "nome_da_acao",
    "payload": { ... },
    "confirmationText": "Deseja que eu [faça X] para você?"
  }
}

- O campo "action" é OPCIONAL — inclua apenas quando for natural executar uma ação concreta
- O campo "suggestions" deve ter 2 a 3 opções curtas (máximo 7 palavras cada)
- Nunca inclua markdown no campo "reply" — apenas texto puro

---

## Ações Disponíveis no Formulário

- **select_service**: payload { value: "florida_llc" | "complete" }
  Quando o cliente indicar o serviço desejado.

- **select_entry_mode**: payload { value: "manual" | "document_assisted" }
  "manual" = preencher dados manualmente; "document_assisted" = enviar documentos primeiro.

- **set_llc_name**: payload { value: "Nome Desejado LLC" }
  Quando o cliente informar o nome da LLC.

- **set_member_count**: payload { value: 1 }
  Quando o cliente informar quantos sócios terá.

- **set_business_activity**: payload { value: "tech"|"ecomm"|"consulting"|"import"|"construction"|"food"|"health"|"realestate"|"education"|"other", custom?: "descrição" }
  Quando o cliente descrever a atividade. Se "other", inclua custom com a descrição.

- **set_registered_agent_choice**: payload { value: "abreusa" | "self" | "other" }
  Quando o cliente escolher o Registered Agent.

- **advance_step**: payload {}
  Quando o cliente confirmar que quer avançar para o próximo passo.`;
}

export async function POST(request: NextRequest) {
  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json({ error: "Assistente não configurado." }, { status: 503 });
  }

  let body: { messages?: unknown; context?: unknown; formContext?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Requisição inválida." }, { status: 400 });
  }

  const messages = Array.isArray(body.messages) ? body.messages : [];
  const context = (body.context ?? {}) as { step?: string };
  const formContext = (body.formContext ?? {}) as Record<string, unknown>;
  const step = typeof context.step === "string" ? context.step : "service";

  const trimmed = messages.slice(-10) as Array<{
    role: "user" | "assistant";
    content: string;
  }>;

  if (trimmed.length === 0 || trimmed[trimmed.length - 1]?.role !== "user") {
    return NextResponse.json({ error: "Nenhuma mensagem do usuário." }, { status: 400 });
  }

  try {
    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const completion = await client.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: buildSystemPrompt(step, formContext) },
        ...trimmed,
      ],
      max_tokens: 600,
      temperature: 0.4,
      response_format: { type: "json_object" },
    });

    const raw = completion.choices[0]?.message?.content ?? "{}";
    let parsed: { reply?: string; suggestions?: string[]; action?: unknown } = {};
    try {
      parsed = JSON.parse(raw);
    } catch {
      parsed = { reply: raw };
    }

    return NextResponse.json({
      reply: parsed.reply ?? "Não foi possível gerar uma resposta.",
      suggestions: Array.isArray(parsed.suggestions)
        ? parsed.suggestions.slice(0, 3)
        : [],
      action: parsed.action ?? null,
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[chat-assistant] OpenAI error:", msg);
    return NextResponse.json({ error: "Erro ao consultar o assistente." }, { status: 500 });
  }
}
