"use client";

import { useEffect, useRef, useState } from "react";

export type ChatAction = {
  type: string;
  payload: Record<string, unknown>;
  confirmationText: string;
};

type AssistantMessage = {
  role: "assistant";
  content: string;
  suggestions?: string[];
  action?: ChatAction;
  actionDone?: boolean;
};

type UserMessage = {
  role: "user";
  content: string;
};

type Message = UserMessage | AssistantMessage;

type Props = {
  activeStep: string;
  selectedService: string | null;
  formContext: Record<string, unknown>;
  onAction: (action: ChatAction) => void;
};

export function ChatAssistant({ activeStep, selectedService, formContext, onAction }: Props) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 100);
  }, [open]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function sendToAPI(history: Message[], userText: string) {
    setLoading(true);
    const apiMessages = history
      .filter((m): m is Message => true)
      .map((m) => ({ role: m.role, content: m.content }));

    try {
      const res = await fetch("/api/chat-assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: apiMessages,
          context: { step: activeStep, service: selectedService },
          formContext,
        }),
      });
      const data = await res.json() as {
        reply?: string;
        suggestions?: string[];
        action?: ChatAction | null;
        error?: string;
      };

      const assistantMsg: AssistantMessage = {
        role: "assistant",
        content: data.reply ?? data.error ?? "Erro ao obter resposta.",
        suggestions: data.suggestions ?? [],
        action: data.action ?? undefined,
        actionDone: false,
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Não foi possível conectar ao assistente. Tente novamente.", actionDone: true },
      ]);
    } finally {
      setLoading(false);
    }
  }

  async function handleSend(text?: string) {
    const content = (text ?? input).trim();
    if (!content || loading) return;
    if (!text) setInput("");

    const userMsg: UserMessage = { role: "user", content };
    const next = [...messages, userMsg];
    setMessages(next);
    await sendToAPI(next, content);
  }

  async function handleSuggestionClick(suggestion: string) {
    await handleSend(suggestion);
  }

  function handleConfirmAction(msgIndex: number, action: ChatAction) {
    // Execute action on the form (parent state updates asynchronously)
    onAction(action);
    // Mark done — suggestions reappear, user continues naturally
    // Next API call happens after React re-renders with fresh formContext
    setMessages((prev) =>
      prev.map((m, i) =>
        i === msgIndex && m.role === "assistant" ? { ...m, actionDone: true } : m,
      ),
    );
  }

  function handleCancelAction(msgIndex: number) {
    setMessages((prev) =>
      prev.map((m, i) =>
        i === msgIndex && m.role === "assistant" ? { ...m, actionDone: true } : m,
      ),
    );
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void handleSend();
    }
  }

  const lastAssistantIdx = messages.reduceRight(
    (found, m, i) => (found === -1 && m.role === "assistant" ? i : found),
    -1,
  );

  return (
    <>
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Fechar assistente" : "Abrir assistente de dúvidas"}
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full bg-emerald-700 px-4 py-3 text-sm font-semibold text-white shadow-lg hover:bg-emerald-800 transition-colors"
      >
        <span className="text-base leading-none">{open ? "✕" : "💬"}</span>
        {!open && <span>Dúvidas?</span>}
      </button>

      {open && (
        <div
          className="fixed bottom-20 right-6 z-50 flex w-80 flex-col rounded-xl border bg-white shadow-2xl sm:w-96"
          style={{ maxHeight: "72vh" }}
        >
          {/* Header */}
          <div className="flex items-center justify-between rounded-t-xl bg-emerald-700 px-4 py-3">
            <div>
              <p className="text-sm font-semibold text-white">Assistente AbreUSA</p>
              <p className="text-xs text-emerald-200">Pergunte ou deixe eu guiar você</p>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="text-emerald-200 hover:text-white text-lg leading-none"
              aria-label="Fechar"
            >
              ✕
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3" style={{ minHeight: "200px" }}>
            {messages.length === 0 && (
              <div className="text-center text-sm text-muted-foreground py-6">
                <p className="text-2xl mb-2">👋</p>
                <p>Olá! Posso responder suas dúvidas ou ajudar a preencher o formulário.</p>
                <p className="mt-1 text-xs">Ex: "Preciso de EIN?" ou "Pode escolher o serviço pra mim?"</p>
              </div>
            )}

            {messages.map((msg, i) => (
              <div key={i} className="space-y-2">
                {/* Message bubble */}
                <div className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm leading-relaxed ${
                      msg.role === "user"
                        ? "bg-emerald-700 text-white rounded-br-sm"
                        : "bg-muted text-foreground rounded-bl-sm"
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>

                {/* Action confirmation card */}
                {msg.role === "assistant" && msg.action && (
                  msg.actionDone ? (
                    <div className="ml-2 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2">
                      <span className="text-emerald-700 text-sm font-semibold">✓ Feito!</span>
                      <span className="text-xs text-emerald-800">{msg.action.confirmationText.replace("Deseja que eu ", "").replace(" para você?", "")}</span>
                    </div>
                  ) : (
                    <div className="ml-2 rounded-xl border border-emerald-200 bg-emerald-50 p-3 space-y-2">
                      <p className="text-xs font-medium text-emerald-900">{msg.action.confirmationText}</p>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleConfirmAction(i, msg.action!)}
                          className="flex-1 rounded-lg bg-emerald-700 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-800 transition-colors"
                        >
                          ✓ Sim, pode fazer
                        </button>
                        <button
                          onClick={() => handleCancelAction(i)}
                          className="flex-1 rounded-lg border border-gray-300 px-3 py-1.5 text-xs text-gray-600 hover:bg-gray-100 transition-colors"
                        >
                          Não, obrigado
                        </button>
                      </div>
                    </div>
                  )
                )}

                {/* Suggestion chips — only on last assistant message, no pending action */}
                {msg.role === "assistant" &&
                  i === lastAssistantIdx &&
                  !loading &&
                  (!msg.action || msg.actionDone) &&
                  (msg.suggestions ?? []).length > 0 && (
                  <div className="ml-2 flex flex-wrap gap-1.5">
                    {(msg.suggestions ?? []).map((s, si) => (
                      <button
                        key={si}
                        onClick={() => void handleSuggestionClick(s)}
                        className="rounded-full border border-emerald-300 bg-white px-3 py-1 text-xs text-emerald-800 hover:bg-emerald-50 hover:border-emerald-500 transition-colors"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="bg-muted rounded-2xl rounded-bl-sm px-3 py-2 text-sm text-muted-foreground">
                  <span className="inline-flex gap-1">
                    <span className="animate-bounce" style={{ animationDelay: "0ms" }}>·</span>
                    <span className="animate-bounce" style={{ animationDelay: "150ms" }}>·</span>
                    <span className="animate-bounce" style={{ animationDelay: "300ms" }}>·</span>
                  </span>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="border-t p-3">
            <div className="flex items-end gap-2">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Pergunte ou peça para eu preencher..."
                rows={1}
                className="flex-1 resize-none rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                style={{ maxHeight: "100px" }}
              />
              <button
                onClick={() => void handleSend()}
                disabled={!input.trim() || loading}
                className="shrink-0 rounded-lg bg-emerald-700 px-3 py-2 text-sm font-medium text-white hover:bg-emerald-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Enviar
              </button>
            </div>
            <p className="mt-1.5 text-xs text-muted-foreground">
              Enter para enviar · Shift+Enter para nova linha
            </p>
          </div>
        </div>
      )}
    </>
  );
}
