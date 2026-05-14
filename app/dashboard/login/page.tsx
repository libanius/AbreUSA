"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createSupabaseBrowserClient } from "@/lib/supabase-browser";

export default function CustomerLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const supabase = createSupabaseBrowserClient();
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
    if (authError) {
      setError("E-mail ou senha incorretos. Verifique os dados e tente novamente.");
      setLoading(false);
      return;
    }
    router.push("/dashboard");
    router.refresh();
  }

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 w-full max-w-sm p-8">
        <p className="text-xs font-bold tracking-widest text-green-700 uppercase mb-1">AbreUSA</p>
        <h1 className="text-xl font-bold text-gray-900 mb-2">Entrar no dashboard</h1>
        <p className="text-sm text-gray-500 mb-6">Acompanhe o status do seu pedido.</p>
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
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Senha
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-600"
            />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-700 text-white rounded-lg py-2 text-sm font-semibold hover:bg-green-800 disabled:opacity-60 transition-colors"
          >
            {loading ? "Entrando\u2026" : "Entrar"}
          </button>
        </form>
        <div className="mt-5 space-y-2 text-center text-sm">
          <p>
            <Link href="/dashboard/reset-password" className="text-green-700 hover:underline">
              Esqueceu a senha?
            </Link>
          </p>
          <p className="text-gray-500">
            Nao tem conta?{" "}
            <Link href="/dashboard/register" className="text-green-700 font-semibold hover:underline">
              Crie aqui
            </Link>
          </p>
          <p className="text-gray-400 text-xs pt-1">
            ou{" "}
            <Link href="/dashboard" className="hover:underline">
              consulte pelo protocolo
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
