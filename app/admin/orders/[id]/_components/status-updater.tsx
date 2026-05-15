"use client";

import { useState } from "react";

const VALID_STATUSES = [
  "draft",
  "awaiting_documents",
  "ready_for_review",
  "customer_reviewing",
  "approved",
  "internal_review",
  "submitted",
  "completed",
  "blocked",
] as const;

type Status = (typeof VALID_STATUSES)[number];

export default function StatusUpdater({
  orderId,
  currentStatus,
  currentCorrectionNotes,
}: {
  orderId: string;
  currentStatus: string;
  currentCorrectionNotes?: string | null;
}) {
  const [status, setStatus] = useState(currentStatus as Status);
  const [notes, setNotes] = useState(currentCorrectionNotes ?? "");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const showNotesField = status === "customer_reviewing";

  async function handleSave() {
    setSaving(true);
    setMessage(null);

    const body: { status: string; correction_notes?: string | null } = { status };
    if (showNotesField) {
      body.correction_notes = notes.trim() || null;
    }

    const res = await fetch(`/api/admin/orders/${orderId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    setSaving(false);
    if (res.ok) {
      setMessage("Saved.");
      setTimeout(() => setMessage(null), 2000);
    } else {
      setMessage("Failed to save.");
    }
  }

  async function handleStatusChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const newStatus = e.target.value as Status;
    setStatus(newStatus);

    // Auto-save immediately only when not switching to customer_reviewing
    // (customer_reviewing needs notes filled first)
    if (newStatus !== "customer_reviewing") {
      setSaving(true);
      setMessage(null);
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      setSaving(false);
      if (res.ok) {
        setMessage("Saved.");
        setTimeout(() => setMessage(null), 2000);
      } else {
        setMessage("Failed to save.");
      }
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-3">
        <select
          value={status}
          onChange={handleStatusChange}
          disabled={saving}
          className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-600 disabled:opacity-60"
        >
          {VALID_STATUSES.map((s) => (
            <option key={s} value={s}>
              {s.replace(/_/g, " ")}
            </option>
          ))}
        </select>
        {saving && <span className="text-xs text-gray-400">Saving…</span>}
        {message && <span className="text-xs text-green-700">{message}</span>}
      </div>

      {showNotesField && (
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-gray-600">
            Instrucoes para o cliente{" "}
            <span className="font-normal text-gray-400">(visivel no dashboard)</span>
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={4}
            placeholder="Ex: O numero do passaporte esta ilegivel. Por favor, envie uma foto mais clara."
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-600 resize-y"
          />
          <button
            onClick={handleSave}
            disabled={saving}
            className="rounded-lg bg-green-700 px-4 py-1.5 text-xs font-semibold text-white hover:bg-green-800 disabled:opacity-60 transition"
          >
            {saving ? "Salvando…" : "Salvar status + instrucoes"}
          </button>
        </div>
      )}
    </div>
  );
}
