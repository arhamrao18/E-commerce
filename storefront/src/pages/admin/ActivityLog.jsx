import { useState } from "react";
import { activityLog } from "../../data/adminExtra";
import { Eyebrow } from "../../components/ui/UI";

const dotColor = { order: "bg-emerald-500", coupon: "bg-brass-500", product: "bg-blue-500", review: "bg-amber-500", security: "bg-red-500", inventory: "bg-violet-500" };

export default function ActivityLog() {
  const [filter, setFilter] = useState("all");
  const types = ["all", ...new Set(activityLog.map((a) => a.type))];
  const items = filter === "all" ? activityLog : activityLog.filter((a) => a.type === filter);

  return (
    <div>
      <Eyebrow>System</Eyebrow>
      <h1 className="mt-2 font-display text-4xl text-ink">Activity log</h1>

      <div className="mt-6 flex flex-wrap gap-2">
        {types.map((t) => (
          <button
            key={t}
            onClick={() => setFilter(t)}
            className={`rounded-full px-3.5 py-1.5 font-mono text-[11px] uppercase tracking-wider ${
              filter === t ? "bg-ink text-porcelain" : "border border-ink/10 bg-white/50 text-ink/50"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="mt-8 rounded-3xl glass p-6 shadow-glass">
        <div className="space-y-6 border-l border-ink/10 pl-6">
          {items.map((a) => (
            <div key={a.id} className="relative">
              <span className={`absolute -left-[27px] top-1.5 h-2.5 w-2.5 rounded-full ${dotColor[a.type]}`} />
              <p className="text-sm text-ink">{a.action}</p>
              <p className="mt-1 font-mono text-[11px] text-ink/40">{a.actor} · {a.time}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
