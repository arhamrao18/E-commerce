import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { TrendingUp, ShoppingBag, Users, Package } from "lucide-react";
import { Eyebrow } from "../../components/ui/UI";
import { revenueByMonth, orderStatusBreakdown, adminOrders, topProducts } from "../../data/admin";

const stats = [
  { label: "Revenue (30d)", value: "$27,950", delta: "+12.4%", icon: TrendingUp },
  { label: "Orders (30d)", value: "214", delta: "+8.1%", icon: ShoppingBag },
  { label: "New customers", value: "63", delta: "+4.6%", icon: Users },
  { label: "Low stock items", value: "5", delta: "Needs attention", icon: Package, warn: true },
];

export default function Dashboard() {
  return (
    <div>
      <Eyebrow>Overview</Eyebrow>
      <h1 className="mt-2 font-display text-4xl text-ink">Dashboard</h1>

      <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-3xl glass p-5 shadow-glass">
            <div className="flex items-center justify-between">
              <span className="text-emerald-600"><s.icon size={18} /></span>
              <span className={`font-mono text-[11px] ${s.warn ? "text-brass-600" : "text-emerald-600"}`}>{s.delta}</span>
            </div>
            <p className="mt-3 font-display text-2xl text-ink">{s.value}</p>
            <p className="font-mono text-[11px] uppercase tracking-wider text-ink/40">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-[1.6fr_1fr]">
        <div className="rounded-3xl glass p-6 shadow-glass">
          <h2 className="font-display text-lg text-ink">Revenue trend</h2>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueByMonth}>
                <defs>
                  <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0F6B5C" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#0F6B5C" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#12151A10" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#12151A66" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#12151A66" }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ borderRadius: 12, border: "1px solid #12151A15", fontSize: 12 }}
                  formatter={(v) => [`$${v.toLocaleString()}`, "Revenue"]}
                />
                <Area type="monotone" dataKey="revenue" stroke="#0F6B5C" strokeWidth={2} fill="url(#rev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-3xl glass p-6 shadow-glass">
          <h2 className="font-display text-lg text-ink">Orders by status</h2>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={orderStatusBreakdown} layout="vertical" margin={{ left: 10 }}>
                <XAxis type="number" hide />
                <YAxis
                  dataKey="status"
                  type="category"
                  width={80}
                  tick={{ fontSize: 11, fill: "#12151A66" }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #12151A15", fontSize: 12 }} />
                <Bar dataKey="count" fill="#C9A15A" radius={[0, 6, 6, 0]} barSize={14} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-2">
        <div className="rounded-3xl glass p-6 shadow-glass">
          <h2 className="font-display text-lg text-ink">Top products</h2>
          <div className="mt-4 space-y-3">
            {topProducts.map((p) => (
              <div key={p.id} className="flex items-center gap-3">
                <img src={p.images[0]} alt="" className="h-12 w-11 rounded-xl object-cover" />
                <div className="flex-1">
                  <p className="text-sm text-ink">{p.name}</p>
                  <p className="font-mono text-[11px] text-ink/40">{p.unitsSold} units sold</p>
                </div>
                <p className="font-mono text-sm text-ink">${p.discountPrice || p.price}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl glass p-6 shadow-glass">
          <h2 className="font-display text-lg text-ink">Recent orders</h2>
          <div className="mt-4 divide-y divide-ink/8">
            {adminOrders.slice(0, 5).map((o) => (
              <div key={o.id} className="flex items-center justify-between py-2.5 text-sm">
                <div>
                  <p className="font-mono text-ink">{o.id}</p>
                  <p className="text-xs text-ink/45">{o.customer}</p>
                </div>
                <p className="font-mono text-ink">${o.total}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
