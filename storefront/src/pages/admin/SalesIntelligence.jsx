import { AreaChart, Area, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { TrendingUp, Repeat, Percent, ShoppingCart } from "lucide-react";
import { Eyebrow } from "../../components/ui/UI";
import { revenueByMonth, topProducts } from "../../data/admin";

const forecast = [...revenueByMonth, { month: "Aug*", revenue: 29800 }, { month: "Sep*", revenue: 31200 }];
const funnel = [
  { name: "Visits", value: 42000, fill: "#0F6B5C" },
  { name: "Product views", value: 18400, fill: "#1D8E7A" },
  { name: "Added to cart", value: 6200, fill: "#C9A15A" },
  { name: "Checkout started", value: 3100, fill: "#DDBD85" },
  { name: "Purchased", value: 2140, fill: "#0E1116" },
];

const stats = [
  { label: "Customer LTV (avg)", value: "$286", icon: TrendingUp },
  { label: "Repeat purchase rate", value: "34%", icon: Repeat },
  { label: "Cart abandonment", value: "48%", icon: ShoppingCart },
  { label: "Gross margin", value: "58%", icon: Percent },
];

export default function SalesIntelligence() {
  return (
    <div>
      <Eyebrow>AI · Sales Intelligence</Eyebrow>
      <h1 className="mt-2 font-display text-4xl text-ink">Sales intelligence</h1>
      <p className="mt-1 max-w-xl text-sm text-ink/50">
        Forecasts and funnel data below are placeholders — they'll populate from live order data once the AI workflow is connected.
      </p>

      <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-3xl glass p-5 shadow-glass">
            <span className="text-emerald-600"><s.icon size={18} /></span>
            <p className="mt-3 font-display text-2xl text-ink">{s.value}</p>
            <p className="font-mono text-[11px] uppercase tracking-wider text-ink/40">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-[1.4fr_1fr]">
        <div className="rounded-3xl glass p-6 shadow-glass">
          <h2 className="font-display text-lg text-ink">Revenue forecast</h2>
          <p className="font-mono text-[11px] text-ink/35">Dashed months (*) are projected</p>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={forecast}>
                <CartesianGrid strokeDasharray="3 3" stroke="#12151A10" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#12151A66" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#12151A66" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #12151A15", fontSize: 12 }} formatter={(v) => [`$${v.toLocaleString()}`, "Revenue"]} />
                <Line type="monotone" dataKey="revenue" stroke="#0F6B5C" strokeWidth={2.5} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-3xl glass p-6 shadow-glass">
          <h2 className="font-display text-lg text-ink">Conversion funnel</h2>
          <div className="mt-4 space-y-2.5">
            {funnel.map((f, i) => (
              <div key={f.name}>
                <div className="flex justify-between font-mono text-[11px] text-ink/50">
                  <span>{f.name}</span>
                  <span>{f.value.toLocaleString()}</span>
                </div>
                <div className="mt-1 h-2.5 w-full rounded-full bg-ink/6">
                  <div
                    className="h-2.5 rounded-full"
                    style={{ width: `${(f.value / funnel[0].value) * 100}%`, backgroundColor: f.fill }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-3xl glass p-6 shadow-glass">
        <h2 className="font-display text-lg text-ink">Best sellers by revenue contribution</h2>
        <div className="mt-4 h-56">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={topProducts.map((p) => ({ name: p.name.split(" ")[0], revenue: (p.discountPrice || p.price) * p.unitsSold }))}>
              <defs>
                <linearGradient id="tp" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#C9A15A" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#C9A15A" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#12151A10" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#12151A66" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#12151A66" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #12151A15", fontSize: 12 }} formatter={(v) => [`$${v.toLocaleString()}`, "Revenue"]} />
              <Area type="monotone" dataKey="revenue" stroke="#A8813F" strokeWidth={2} fill="url(#tp)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
