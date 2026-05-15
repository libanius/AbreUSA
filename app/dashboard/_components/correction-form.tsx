"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type CorrectionFormProps = {
  orderId: string;
  correctionNotes: string | null;
  missingFlags: string[];
  initialApplicant: {
    phone: string;
    residential_street: string;
    residential_city: string;
    residential_state: string;
    residential_zip: string;
  };
  initialLlc: {
    legal_name: string;
    business_activity_label: string;
    principal_street: string;
    principal_city: string;
    principal_state: string;
    principal_zip: string;
  };
};

function Field({
  label,
  id,
  value,
  onChange,
}: {
  label: string;
  id: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-xs font-semibold text-gray-600 mb-1">
        {label}
      </label>
      <input
        id={id}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-600"
      />
    </div>
  );
}

export default function CorrectionForm({
  orderId,
  correctionNotes,
  missingFlags,
  initialApplicant,
  initialLlc,
}: CorrectionFormProps) {
  const router = useRouter();
  const [applicant, setApplicant] = useState(initialApplicant);
  const [llc, setLlc] = useState(initialLlc);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  function setA(field: keyof typeof applicant, value: string) {
    setApplicant((prev) => ({ ...prev, [field]: value }));
  }
  function setL(field: keyof typeof llc, value: string) {
    setLlc((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch(`/api/customer/orders/${orderId}/correction`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ applicant, llc }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({})) as { error?: string };
        setError(body.error ?? "Nao foi possivel enviar a correcao. Tente novamente.");
        setLoading(false);
        return;
      }

      setSuccess(true);
      router.refresh();
    } catch {
      setError("Erro de conexao. Tente novamente.");
    }
    setLoading(false);
  }

  if (success) {
    return (
      <div className="rounded-lg border border-green-200 bg-green-50 p-5 text-sm text-green-900">
        <p className="font-semibold">Correcao enviada com sucesso.</p>
        <p className="mt-1">
          Sua correcao foi recebida e o pedido voltou para revisao interna. A equipe AbreUSA
          entrara em contato se precisar de mais informacoes.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-orange-200 bg-orange-50 p-5 space-y-5">
      <div>
        <p className="text-sm font-semibold text-orange-900">
          A equipe AbreUSA identificou informacoes que precisam de atualizacao.
        </p>

        {correctionNotes ? (
          <div className="mt-3 rounded-lg border border-orange-300 bg-white px-4 py-3">
            <p className="text-xs font-semibold text-orange-700 uppercase tracking-wide mb-1">
              Instrucoes da equipe AbreUSA
            </p>
            <p className="text-sm text-gray-800 whitespace-pre-wrap">{correctionNotes}</p>
          </div>
        ) : (
          <p className="mt-1 text-sm text-orange-800">
            Revise e corrija os campos abaixo e clique em Enviar correcao.
          </p>
        )}

        {missingFlags.length > 0 && (
          <ul className="mt-2 list-disc list-inside text-xs text-orange-700 space-y-0.5">
            {missingFlags.map((flag) => (
              <li key={flag}>{flag.replace(/_/g, " ")}</li>
            ))}
          </ul>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <section className="rounded-lg bg-white border border-gray-200 p-4 space-y-3">
          <h3 className="text-sm font-semibold text-gray-950">Dados do solicitante</h3>
          <Field
            label="Telefone"
            id="phone"
            value={applicant.phone}
            onChange={(v) => setA("phone", v)}
          />
          <Field
            label="Rua (endereco residencial)"
            id="res_street"
            value={applicant.residential_street}
            onChange={(v) => setA("residential_street", v)}
          />
          <div className="grid grid-cols-2 gap-3">
            <Field
              label="Cidade"
              id="res_city"
              value={applicant.residential_city}
              onChange={(v) => setA("residential_city", v)}
            />
            <Field
              label="Estado"
              id="res_state"
              value={applicant.residential_state}
              onChange={(v) => setA("residential_state", v)}
            />
          </div>
          <Field
            label="CEP / ZIP"
            id="res_zip"
            value={applicant.residential_zip}
            onChange={(v) => setA("residential_zip", v)}
          />
        </section>

        <section className="rounded-lg bg-white border border-gray-200 p-4 space-y-3">
          <h3 className="text-sm font-semibold text-gray-950">Dados da LLC</h3>
          <Field
            label="Nome da LLC"
            id="llc_name"
            value={llc.legal_name}
            onChange={(v) => setL("legal_name", v)}
          />
          <Field
            label="Atividade empresarial"
            id="llc_activity"
            value={llc.business_activity_label}
            onChange={(v) => setL("business_activity_label", v)}
          />
          <Field
            label="Rua (endereco principal)"
            id="llc_street"
            value={llc.principal_street}
            onChange={(v) => setL("principal_street", v)}
          />
          <div className="grid grid-cols-2 gap-3">
            <Field
              label="Cidade"
              id="llc_city"
              value={llc.principal_city}
              onChange={(v) => setL("principal_city", v)}
            />
            <Field
              label="Estado"
              id="llc_state"
              value={llc.principal_state}
              onChange={(v) => setL("principal_state", v)}
            />
          </div>
          <Field
            label="ZIP"
            id="llc_zip"
            value={llc.principal_zip}
            onChange={(v) => setL("principal_zip", v)}
          />
        </section>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-green-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-green-800 disabled:opacity-60"
        >
          {loading ? "Enviando…" : "Enviar correcao"}
        </button>
      </form>
    </div>
  );
}
