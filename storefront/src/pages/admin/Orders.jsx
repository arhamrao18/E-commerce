import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { adminOrders } from "../../data/admin";
import { Eyebrow } from "../../components/ui/UI";

const STATUSES = ["Pending", "Paid", "Processing", "Shipped", "Delivered", "Cancelled", "Refunded"];

const statusColor = {
  Pending: "bg-ink/8 text-ink/60",
  Paid: "bg-emerald-50 text-emerald-700",
  Processing: "bg-brass-100 text-brass-600",
  Shipped: "bg-blue-50 text-blue-600",
  Delivered: "bg-emerald-50 text-emerald-700",
  Cancelled: "bg-red-50 text-red-600",
  Refunded: "bg-ink/8 text-ink/60",
};

export default function Orders() {
  const [orders, setOrders] = useState(adminOrders);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const updateStatus = (id, status) => {
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
  };

  const filtered = useMemo(
    () =>
      orders.filter(
        (o) =>
          (o.id.toLowerCase().includes(query.toLowerCase()) || o.customer.toLowerCase().includes(query.toLowerCase())) &&
          (!statusFilter || o.status === statusFilter)
      ),
    [orders, query, statusFilter]
  );

  return (
    <div>
      <Eyebrow>Sales</Eyebrow>
      <h1 className="mt-2 font-display text-4xl text-ink">Orders ({orders.length})</h1>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-3 rounded-full border border-ink/15 bg-white/50 px-4 py-2.5 sm:max-w-xs">
          <Search size={16} className="text-ink/40" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search order or customer…"
            className="w-full bg-transparent text-sm focus:outline-none"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-full border border-ink/15 bg-white/50 px-4 py-2.5 font-mono text-xs uppercase tracking-wider focus:outline-none"
        >
          <option value="">All statuses</option>
          {STATUSES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      <div className="mt-6 overflow-x-auto rounded-3xl glass shadow-glass">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead>
            <tr className="border-b border-ink/8 font-mono text-[11px] uppercase tracking-wider text-ink/40">
              <th className="px-5 py-3.5">Order</th>
              <th className="px-5 py-3.5">Customer</th>
              <th className="px-5 py-3.5">Date</th>
              <th className="px-5 py-3.5">Items</th>
              <th className="px-5 py-3.5">Total</th>
              <th className="px-5 py-3.5">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink/6">
            {filtered.map((o) => (
              <tr key={o.id} className="hover:bg-white/40">
                <td className="px-5 py-3 font-mono text-ink">{o.id}</td>
                <td className="px-5 py-3 text-ink/80">{o.customer}</td>
                <td className="px-5 py-3 font-mono text-xs text-ink/50">{o.date}</td>
                <td className="px-5 py-3 text-ink/60">{o.items.map((i) => i.product.name).join(", ")}</td>
                <td className="px-5 py-3 font-mono text-ink">${o.total}</td>
                <td className="px-5 py-3">
                  <select
                    value={o.status}
                    onChange={(e) => updateStatus(o.id, e.target.value)}
                    className={`rounded-full border-none px-2.5 py-1 font-mono text-[11px] focus:outline-none ${statusColor[o.status]}`}
                  >
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="px-5 py-10 text-center text-ink/40">No orders match your filters</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
