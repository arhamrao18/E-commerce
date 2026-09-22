import { useState } from "react";
import { LineChart, Line, ResponsiveContainer, YAxis } from "recharts";
import { AlertTriangle, TrendingDown, TrendingUp, PackageSearch } from "lucide-react";
import { inventoryPredictions } from "../../data/adminExtra";
import { Eyebrow } from "../../components/ui/UI";

const velocityStyle = {
  "Fast moving": "bg-emerald-50 text-emerald-700",
  "Steady": "bg-blue-50 text-blue-600",
  "Slow moving": "bg-brass-100 text-brass-600",
  "Dead stock": "bg-red-50 text-red-600",
};

export default function InventoryPrediction() {
  const [sort, setSort] = useState("risk");

  const sorted = [...inventoryPredictions].sort((a, b) =>
    sort === "risk" ? a.daysToStockOut - b.daysToStockOut : b.healthScore - a.healthScore
  );

  const overstock = inventoryPredictions.filter((p) => p.velocity === "Dead stock" || p.velocity === "Slow moving").length;
  const avgHealth = Math.round(inventoryPredictions.reduce((s, p) => s + p.healthScore, 0) / inventoryPredictions.length);

  return (
    <div>
      <Eyebrow>AI · Inventory Prediction</Eyebrow>
      <h1 className="mt-2 font-display text-4xl text-ink">Inventory prediction</h1>
      <p className="mt-1 max-w-xl text-sm text-ink/50">
        Forecasts are placeholder values with a realistic shape — the AI workflow will replace them with live demand modeling.
      </p>

      <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Stat label="Avg. inventory health" value={`${avgHealth}/100`} icon={PackageSearch} />
        <Stat label="Products at risk (<14d)" value={inventoryPredictions.filter((p) => p.daysToStockOut < 14).length} icon={AlertTriangle} warn />
        <Stat label="Overstock / dead stock" value={overstock} icon={TrendingDown} warn />
        <Stat label="Fast movers" value={inventoryPredictions.filter((p) => p.velocity === "Fast moving").length} icon={TrendingUp} />
      </div>

      <div className="mt-6 flex gap-2">
        <button onClick={() => setSort("risk")} className={`rounded-full px-4 py-2 font-mono text-xs uppercase tracking-wider ${sort === "risk" ? "bg-ink text-porcelain" : "border border-ink/10 bg-white/50 text-ink/50"}`}>Sort by stock-out risk</button>
        <button onClick={() => setSort("health")} className={`rounded-full px-4 py-2 font-mono text-xs uppercase tracking-wider ${sort === "health" ? "bg-ink text-porcelain" : "border border-ink/10 bg-white/50 text-ink/50"}`}>Sort by health score</button>
      </div>

      <div className="mt-6 overflow-x-auto rounded-3xl glass shadow-glass">
        <table className="w-full min-w-[860px] text-left text-sm">
          <thead>
            <tr className="border-b border-ink/8 font-mono text-[11px] uppercase tracking-wider text-ink/40">
              <th className="px-5 py-3.5">Product</th>
              <th className="px-5 py-3.5">Demand trend</th>
              <th className="px-5 py-3.5">Health</th>
              <th className="px-5 py-3.5">Velocity</th>
              <th className="px-5 py-3.5">Stock-out in</th>
              <th className="px-5 py-3.5">Recommended restock</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink/6">
            {sorted.map((p) => (
              <tr key={p.id} className="hover:bg-white/40">
                <td className="flex items-center gap-3 px-5 py-3">
                  <img src={p.images[0]} alt="" className="h-10 w-9 rounded-lg object-cover" />
                  <span className="text-ink">{p.name}</span>
                </td>
                <td className="px-5 py-3">
                  <div className="h-8 w-24">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={p.demandTrend}>
                        <YAxis hide domain={["dataMin - 5", "dataMax + 5"]} />
                        <Line type="monotone" dataKey="demand" stroke="#0F6B5C" strokeWidth={1.75} dot={false} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </td>
                <td className="px-5 py-3">
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-16 rounded-full bg-ink/8">
                      <div className="h-1.5 rounded-full bg-emerald-500" style={{ width: `${p.healthScore}%` }} />
                    </div>
                    <span className="font-mono text-xs text-ink/55">{p.healthScore}</span>
                  </div>
                </td>
                <td className="px-5 py-3"><span className={`rounded-full px-2.5 py-1 font-mono text-[11px] ${velocityStyle[p.velocity]}`}>{p.velocity}</span></td>
                <td className={`px-5 py-3 font-mono text-xs ${p.daysToStockOut < 14 ? "text-red-600" : "text-ink/55"}`}>{p.daysToStockOut} days</td>
                <td className="px-5 py-3 font-mono text-xs text-ink/60">{p.recommendedRestock} units</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Stat({ label, value, icon: Icon, warn }) {
  return (
    <div className="rounded-3xl glass p-5 shadow-glass">
      <span className={warn ? "text-brass-600" : "text-emerald-600"}><Icon size={18} /></span>
      <p className="mt-3 font-display text-2xl text-ink">{value}</p>
      <p className="font-mono text-[11px] uppercase tracking-wider text-ink/40">{label}</p>
    </div>
  );
}
