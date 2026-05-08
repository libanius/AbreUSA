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

export default function StatusUpdater({ orderId, currentStatus }: { orderId: string; currentStatus: string }) {
  const [status, setStatus] = useState(currentStatus);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const newStatus = e.target.value as Status;
    setStatus(newStatus);
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
      setStatus(currentStatus);
    }
  }

  return (
    <div className="flex items-center gap-3">
      <select
        value={status}
        onChange={handleChange}
        disabled={saving}
        className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-600 disabled:opacity-60"
      >
        {VALID_STATUSES.map(s => (
          <option key={s} value={s}>{s.replace(/_/g, " ")}</option>
        ))}
      </select>
      {saving && <span className="text-xs text-gray-400">Saving…</span>}
      {message && <span className="text-xs text-green-700">{message}</span>}
    </div>
  );
}
