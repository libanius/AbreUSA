"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function DeleteDocumentButton({ documentId }: { documentId: string }) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleDelete() {
    setDeleting(true);
    setError(null);

    const res = await fetch(`/api/admin/documents/${documentId}`, {
      method: "DELETE",
    });

    setDeleting(false);
    setConfirming(false);

    if (res.ok) {
      router.refresh();
    } else {
      const body = await res.json().catch(() => ({})) as { error?: string };
      setError(body.error ?? "Deletion failed.");
    }
  }

  if (confirming) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-xs text-red-700 font-semibold">Delete permanently?</span>
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="text-xs px-3 py-1.5 rounded-lg bg-red-600 text-white hover:bg-red-700 font-semibold transition-colors disabled:opacity-60"
        >
          {deleting ? "Deleting\u2026" : "Confirm"}
        </button>
        <button
          onClick={() => { setConfirming(false); setError(null); }}
          disabled={deleting}
          className="text-xs px-3 py-1.5 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 font-semibold transition-colors disabled:opacity-60"
        >
          Cancel
        </button>
        {error && <span className="text-xs text-red-600">{error}</span>}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => setConfirming(true)}
        className="text-xs px-3 py-1.5 rounded-lg bg-red-50 text-red-700 hover:bg-red-100 font-semibold transition-colors"
      >
        Delete file
      </button>
      {error && <span className="text-xs text-red-600">{error}</span>}
    </div>
  );
}
