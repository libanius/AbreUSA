"use client";

import { useState } from "react";

export default function DocumentDownloadButton({ documentId }: { documentId: string }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleClick() {
    setError(null);
    setLoading(true);
    try {
      const res = await fetch(`/api/customer/documents/${documentId}/signed-url`);
      if (!res.ok) {
        const body = await res.json().catch(() => ({})) as { error?: string };
        setError(body.error ?? "Nao foi possivel abrir o documento.");
        setLoading(false);
        return;
      }
      const { signedUrl } = await res.json() as { signedUrl: string };
      window.open(signedUrl, "_blank", "noopener,noreferrer");
    } catch {
      setError("Erro de conexao. Tente novamente.");
    }
    setLoading(false);
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        onClick={handleClick}
        disabled={loading}
        className="rounded-lg border border-gray-200 px-3 py-1 text-xs font-semibold text-gray-700 transition hover:bg-gray-50 disabled:opacity-60"
      >
        {loading ? "Abrindo\u2026" : "Ver documento"}
      </button>
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}
