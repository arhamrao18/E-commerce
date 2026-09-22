import { useState } from "react";
import { ShieldAlert, ShieldCheck, Eye, Check, Ban } from "lucide-react";
import { fraudOrders } from "../../data/adminExtra";
import { Eyebrow } from "../../components/ui/UI";

function riskColor(score) {
  if (score >= 70) return "text-red-600 bg-red-50";
  if (score >= 40) return "text-brass-600 bg-brass-100";
  return "text-emerald-700 bg-emerald-50";
}

export default function FraudDetection() {
  const [orders, setOrders] = useState(fraudOrders);
  const [selected, setSelected] = useState(null);

  const resolve = (id, status) => {
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
    setSelected(null);
  };

  const highRisk = orders.filter((o) => o.riskScore >= 70).length;
  const inReview = orders.filter((o) => o.status === "Manual review").length;

  return (
    <div>
      <Eyebrow>AI · Fraud Detection</Eyebrow>
      <h1 className="mt-2 font-display text-4xl text-ink">Fraud detection</h1>
      <p className="mt-1 max-w-xl text-sm text-ink/50">
        Risk scores and signals below are placeholder data — the n8n workflow will score orders as they come in.
      </p>

      <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <div className="rounded-3xl glass p-5 shadow-glass">
          <span className="text-red-600"><ShieldAlert size={18} /></span>
          <p className="mt-3 font-display text-2xl text-ink">{highRisk}</p>
          <p className="font-mono text-[11px] uppercase tracking-wider text-ink/40">High-risk orders</p>
        </div>
        <div className="rounded-3xl glass p-5 shadow-glass">
          <span className="text-brass-600"><Eye size={18} /></span>
          <p className="mt-3 font-display text-2xl text-ink">{inReview}</p>
          <p className="font-mono text-[11px] uppercase tracking-wider text-ink/40">In manual review</p>
        </div>
        <div className="rounded-3xl glass p-5 shadow-glass">
          <span className="text-emerald-600"><ShieldCheck size={18} /></span>
          <p className="mt-3 font-display text-2xl text-ink">{orders.filter((o) => o.status === "Cleared").length}</p>
          <p className="font-mono text-[11px] uppercase tracking-wider text-ink/40">Cleared today</p>
        </div>
        <div className="rounded-3xl glass p-5 shadow-glass">
          <span className="text-ink/60"><Ban size={18} /></span>
          <p className="mt-3 font-display text-2xl text-ink">0</p>
          <p className="font-mono text-[11px] uppercase tracking-wider text-ink/40">Blocked this week</p>
        </div>
      </div>

      <div className="mt-6 overflow-x-auto rounded-3xl glass shadow-glass">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead>
            <tr className="border-b border-ink/8 font-mono text-[11px] uppercase tracking-wider text-ink/40">
              <th className="px-5 py-3.5">Order</th>
              <th className="px-5 py-3.5">Customer</th>
              <th className="px-5 py-3.5">Amount</th>
              <th className="px-5 py-3.5">Risk score</th>
              <th className="px-5 py-3.5">Status</th>
              <th className="px-5 py-3.5"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink/6">
            {orders.map((o) => (
              <tr key={o.id} className="hover:bg-white/40">
                <td className="px-5 py-3 font-mono text-ink">{o.id}</td>
                <td className="px-5 py-3 text-ink/70">{o.customer}</td>
                <td className="px-5 py-3 font-mono text-ink">${o.amount}</td>
                <td className="px-5 py-3">
                  <span className={`rounded-full px-2.5 py-1 font-mono text-[11px] ${riskColor(o.riskScore)}`}>{o.riskScore}/100</span>
                </td>
                <td className="px-5 py-3 text-ink/60">{o.status}</td>
                <td className="px-5 py-3">
                  <button onClick={() => setSelected(o)} className="font-mono text-[11px] uppercase tracking-wider text-emerald-600 underline">Review</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/50 p-6" onClick={() => setSelected(null)}>
          <div onClick={(e) => e.stopPropagation()} className="w-full max-w-md rounded-4xl bg-porcelain-50 p-8 shadow-glass-lg">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-xl text-ink">{selected.id}</h2>
              <span className={`rounded-full px-2.5 py-1 font-mono text-[11px] ${riskColor(selected.riskScore)}`}>{selected.riskScore}/100</span>
            </div>
            <p className="mt-1 text-sm text-ink/60">{selected.customer} · ${selected.amount}</p>
            <div className="mt-5">
              <p className="font-mono text-[11px] uppercase tracking-wider text-ink/40">Risk signals</p>
              {selected.reasons.length === 0 ? (
                <p className="mt-2 text-sm text-ink/50">No risk signals detected.</p>
              ) : (
                <ul className="mt-2 space-y-1.5 text-sm text-ink/70">
                  {selected.reasons.map((r) => (
                    <li key={r} className="flex items-start gap-2"><span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-red-500" />{r}</li>
                  ))}
                </ul>
              )}
            </div>
            <div className="mt-7 flex gap-3">
              <button onClick={() => resolve(selected.id, "Cleared")} className="flex flex-1 items-center justify-center gap-2 rounded-full bg-emerald-600 py-2.5 text-sm font-semibold text-porcelain"><Check size={15} /> Clear order</button>
              <button onClick={() => resolve(selected.id, "Blocked")} className="flex flex-1 items-center justify-center gap-2 rounded-full border border-red-200 py-2.5 text-sm font-semibold text-red-600"><Ban size={15} /> Block</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
