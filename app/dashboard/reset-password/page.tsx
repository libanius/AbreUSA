"use client";

import { useState } from "react";
import Link from "next/link";
import { createSupabaseBrowserClient } from "@/lib/supabase-browser";

export default function ResetPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const supabase = createSupabaseBrowserClient();
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/confirm?next=/dashboard/update-password`,
    });
    if (resetError) {
      setError("Nao foi possivel enviar o link. Tente novamente.");
      setLoading(false);
      return;
    }
    setSent(true);
    setLoading(false);
  }

  if (sent) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 w-full max-w-sm p-8 text-center">
          <p className="text-xs font-bold tracking-widest text-green-700 uppercase mb-3">AbreUSA</p>
          <h1 className="text-xl font-bold text-gray-900 mb-3">Verifique seu e-mail</h1>
          <p className="text-sm text-gray-600 mb-5">
            Se este e-mail esta cadastrado, voce recebera um link para redefinir sua senha.
          </p>
          <Link href="/dashboard/login" className="text-sm text-green-700 font-semibold hover:underline">
            Voltar ao login
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 w-full max-w-sm p-8">
        <p className="text-xs font-bold tracking-widest text-green-700 uppercase mb-1">AbreUSA</p>
        <h1 className="text-xl font-bold text-gray-900 mb-2">Redefinir senha</h1>
        <p className="text-sm text-gray-500 mb-6">
          Informe seu e-mail para receber o link de redefinicao.
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              E-mail
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-600"
            />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-700 text-white rounded-lg py-2 text-sm font-semibold hover:bg-green-800 disabled:opacity-60 transition-colors"
          >
            {loading ? "Enviando\u2026" : "Enviar link de redefinicao"}
          </button>
        </form>
        <p className="mt-5 text-center text-sm">
          <Link href="/dashboard/login" className="text-green-700 hover:underline">
            Voltar ao login
          </Link>
        </p>
      </div>
    </main>
  );
}
