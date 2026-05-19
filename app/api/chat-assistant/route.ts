import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

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

function buildSystemPrompt(step: string, formContext: Record<string, unknown>): string {
  const stepLabel = STEP_LABELS[step] ?? step;
  const serviceLabel = typeof formContext.service === "string"
    ? (SERVICE_LABELS[formContext.service] ?? formContext.service)
    : "não selecionado";
  const llcName = formContext.llcName || "não definido";
  const memberCount = formContext.memberCount ?? 1;
  const businessActivity = typeof formContext.businessActivity === "string"
    ? (BUSINESS_LABELS[formContext.businessActivity] ?? formContext.businessActivity)
    : "não definida";
  const agentChoice = typeof formContext.registeredAgentChoice === "string"
    ? (AGENT_LABELS[formContext.registeredAgentChoice] ?? formContext.registeredAgentChoice)
    : "não escolhido";
  const entryMode = formContext.entryMode === "document_assisted" ? "envio de documentos" : formContext.entryMode === "manual" ? "preenchimento manual" : "não definido";

  return `Você é o assistente virtual da AbreUSA, empresa que ajuda brasileiros a abrir empresas nos Estados Unidos.

ESTADO ATUAL DO FORMULÁRIO DO CLIENTE:
- Passo atual: ${stepLabel}
- Serviço: ${serviceLabel}
- Modo de entrada: ${entryMode}
- Nome da LLC: ${llcName}
- Número de sócios: ${memberCount}
- Atividade: ${businessActivity}
- Registered Agent escolhido: ${agentChoice}
- Nome do solicitante: ${formContext.applicantName || "não informado"}

SEU PAPEL:
Você guia o cliente pelo processo de abertura de empresa. Você responde dúvidas E pode executar ações no formulário mediante confirmação do cliente.

FORMATO DE RESPOSTA — RETORNE SEMPRE JSON VÁLIDO:
{
  "reply": "sua resposta em português, clara e concisa",
  "suggestions": ["opção 1", "opção 2", "opção 3"],
  "action": {
    "type": "nome_da_acao",
    "payload": { ... },
    "confirmationText": "Deseja que eu [faça X] para você?"
  }
}
O campo "action" é OPCIONAL. Inclua apenas quando for natural sugerir executar uma ação concreta.
O campo "suggestions" deve ter 2 a 3 opções curtas (máximo 7 palavras cada).

AÇÕES DISPONÍVEIS:
- select_service: payload { value: "florida_llc" | "complete" }
  Use quando o cliente indicar serviço desejado (LLC somente = "florida_llc"; LLC+EIN = "complete").
  
- select_entry_mode: payload { value: "manual" | "document_assisted" }
  "manual" = preencher dados manualmente; "document_assisted" = enviar documentos primeiro.
  
- set_llc_name: payload { value: "Nome Desejado LLC" }
  Use quando o cliente informar o nome da LLC.
  
- set_member_count: payload { value: 1 }
  Use quando o cliente informar quantos sócios terá.
  
- set_business_activity: payload { value: "tech"|"ecomm"|"consulting"|"import"|"construction"|"food"|"health"|"realestate"|"education"|"other", custom?: "descrição" }
  Use quando o cliente descrever a atividade. Se "other", inclua custom com a descrição.
  
- set_registered_agent_choice: payload { value: "abreusa" | "self" | "other" }
  Use quando o cliente escolher o Registered Agent.
  
- advance_step: payload {}
  Use quando o cliente confirmar que quer avançar para o próximo passo (após dados já preenchidos).

REGRAS:
1. Nunca execute uma ação sem pedir confirmação ao cliente — use o campo "action" com "confirmationText".
2. O "confirmationText" deve ser uma pergunta direta: "Deseja que eu selecione LLC na Flórida para você?"
3. As "suggestions" devem refletir as respostas mais prováveis do cliente.
4. Responda em português brasileiro, máximo 3 parágrafos curtos.
5. Não dê aconselhamento jurídico ou tributário.
6. Se o cliente perguntar algo fora do escopo (abertura de empresa nos EUA), responda: "Posso ajudar com dúvidas sobre o processo de abertura da sua empresa nos EUA."

CONHECIMENTO:
- LLC na Flórida: não requer SSN — estrangeiros podem abrir.
- EIN: número federal de identificação fiscal. Necessário para conta bancária empresarial.
- Registered Agent: representante legal obrigatório na Flórida.
- Documentos: passaporte válido + comprovante de endereço.`;
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

  const trimmed = messages.slice(-10) as Array<{ role: "user" | "assistant"; content: string }>;

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
      suggestions: Array.isArray(parsed.suggestions) ? parsed.suggestions.slice(0, 3) : [],
      action: parsed.action ?? null,
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[chat-assistant] OpenAI error:", msg);
    return NextResponse.json({ error: "Erro ao consultar o assistente." }, { status: 500 });
  }
}
