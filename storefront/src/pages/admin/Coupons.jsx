import { useState } from "react";
import { Plus, Copy, Trash2 } from "lucide-react";
import { coupons as seed } from "../../data/adminExtra";
import { Eyebrow, Button } from "../../components/ui/UI";
import { useStore } from "../../context/StoreContext";

const statusColor = {
  Active: "bg-emerald-50 text-emerald-700",
  Scheduled: "bg-brass-100 text-brass-600",
  Expired: "bg-ink/8 text-ink/45",
};

export default function Coupons() {
  const [coupons, setCoupons] = useState(seed);
  const { notify } = useStore();

  const copy = (code) => {
    navigator.clipboard?.writeText(code);
    notify(`Copied ${code}`);
  };
  const remove = (id) => setCoupons((prev) => prev.filter((c) => c.id !== id));

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <Eyebrow>Promotions</Eyebrow>
          <h1 className="mt-2 font-display text-4xl text-ink">Coupons ({coupons.length})</h1>
        </div>
        <Button><Plus size={16} /> Create coupon</Button>
      </div>

      <div className="mt-6 overflow-x-auto rounded-3xl glass shadow-glass">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead>
            <tr className="border-b border-ink/8 font-mono text-[11px] uppercase tracking-wider text-ink/40">
              <th className="px-5 py-3.5">Code</th>
              <th className="px-5 py-3.5">Type</th>
              <th className="px-5 py-3.5">Scope</th>
              <th className="px-5 py-3.5">Usage</th>
              <th className="px-5 py-3.5">Expires</th>
              <th className="px-5 py-3.5">Status</th>
              <th className="px-5 py-3.5"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink/6">
            {coupons.map((c) => (
              <tr key={c.id} className="hover:bg-white/40">
                <td className="px-5 py-3">
                  <button onClick={() => copy(c.code)} className="flex items-center gap-2 font-mono text-ink hover:text-emerald-600">
                    {c.code} <Copy size={12} />
                  </button>
                </td>
                <td className="px-5 py-3 text-ink/70">
                  {c.type}{c.type !== "Free shipping" ? ` — ${c.value}${c.type === "Percentage" ? "%" : "$"}` : ""}
                </td>
                <td className="px-5 py-3 text-ink/60">{c.scope}</td>
                <td className="px-5 py-3 font-mono text-xs text-ink/55">{c.uses}{c.limit ? ` / ${c.limit}` : ""}</td>
                <td className="px-5 py-3 font-mono text-xs text-ink/50">{c.expires}</td>
                <td className="px-5 py-3"><span className={`rounded-full px-2.5 py-1 font-mono text-[11px] ${statusColor[c.status]}`}>{c.status}</span></td>
                <td className="px-5 py-3">
                  <button onClick={() => remove(c.id)} className="rounded-lg p-1.5 text-ink/50 hover:bg-red-50 hover:text-red-600"><Trash2 size={15} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
