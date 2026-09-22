import { useState } from "react";
import { Plus, ChevronDown } from "lucide-react";
import { roles } from "../../data/adminExtra";
import { Eyebrow, Button } from "../../components/ui/UI";

const MODULES = ["Dashboard", "Products", "Orders", "Customers", "Coupons", "Reviews", "Reports", "Settings", "Roles"];

export default function Roles() {
  const [expanded, setExpanded] = useState(null);

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <Eyebrow>Access control</Eyebrow>
          <h1 className="mt-2 font-display text-4xl text-ink">Roles & permissions</h1>
        </div>
        <Button><Plus size={16} /> New role</Button>
      </div>

      <div className="mt-8 space-y-3">
        {roles.map((r) => (
          <div key={r.id} className="rounded-3xl glass shadow-glass">
            <button
              onClick={() => setExpanded(expanded === r.id ? null : r.id)}
              className="flex w-full items-center justify-between gap-4 p-5 text-left"
            >
              <div>
                <p className="font-display text-lg text-ink">{r.name}</p>
                <p className="font-mono text-[11px] text-ink/40">{r.users} user{r.users !== 1 ? "s" : ""} · {r.permissions}</p>
              </div>
              <ChevronDown size={18} className={`text-ink/40 transition-transform ${expanded === r.id ? "rotate-180" : ""}`} />
            </button>
            {expanded === r.id && (
              <div className="grid grid-cols-2 gap-3 border-t border-ink/8 p-5 sm:grid-cols-3">
                {MODULES.map((m) => (
                  <label key={m} className="flex items-center gap-2.5 text-sm text-ink/70">
                    <input type="checkbox" defaultChecked={r.name !== "Customer Support" || ["Orders", "Customers", "Reviews"].includes(m)} className="h-3.5 w-3.5 accent-emerald-600" />
                    {m}
                  </label>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
