import Link from "next/link";
import { getSupabaseServerClient } from "@/lib/supabase-server";

export const dynamic = "force-dynamic";

const SERVICE_LABELS: Record<string, string> = {
  complete_llc_ein: "Complete Package",
  florida_llc: "Florida LLC",
};

const STATUS_COLORS: Record<string, string> = {
  draft: "bg-gray-100 text-gray-700",
  awaiting_documents: "bg-yellow-100 text-yellow-800",
  ready_for_review: "bg-blue-100 text-blue-800",
  customer_reviewing: "bg-purple-100 text-purple-800",
  approved: "bg-green-100 text-green-800",
  internal_review: "bg-orange-100 text-orange-800",
  submitted: "bg-teal-100 text-teal-800",
  completed: "bg-green-200 text-green-900",
  blocked: "bg-red-100 text-red-800",
};

type OrderWithApplicant = {
  id: string;
  protocol_number: string;
  service_type: string;
  status: string;
  created_at: string;
  applicants: { name: string; email: string }[] | null;
};

export default async function AdminOrdersPage() {
  const supabase = getSupabaseServerClient();
  const { data: orders, error } = await (supabase as ReturnType<typeof getSupabaseServerClient>)
    .from("orders")
    .select("id, protocol_number, service_type, status, created_at, applicants(name, email)")
    .order("created_at", { ascending: false });

  if (error) {
    return <p className="text-red-600">Failed to load orders: {error.message}</p>;
  }

  const rows = (orders ?? []) as unknown as OrderWithApplicant[];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Orders</h1>
      {rows.length === 0 ? (
        <p className="text-gray-500">No orders yet.</p>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-gray-700">Protocol</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-700">Service</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-700">Applicant</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-700">Email</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-700">Status</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-700">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {rows.map(order => {
                const applicant = order.applicants?.[0];
                const statusColor = STATUS_COLORS[order.status] ?? "bg-gray-100 text-gray-700";
                return (
                  <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <Link href={`/admin/orders/${order.id}`} className="font-mono text-green-700 hover:underline font-semibold">
                        {order.protocol_number}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-gray-700">{SERVICE_LABELS[order.service_type] ?? order.service_type}</td>
                    <td className="px-4 py-3 text-gray-900">{applicant?.name ?? "—"}</td>
                    <td className="px-4 py-3 text-gray-600">{applicant?.email ?? "—"}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${statusColor}`}>
                        {order.status.replace(/_/g, " ")}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-500">
                      {new Date(order.created_at).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
