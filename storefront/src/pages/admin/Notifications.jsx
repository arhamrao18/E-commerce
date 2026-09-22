import { useState } from "react";
import { ShoppingBag, PackageX, Star, CreditCard, Sparkles, User, Check } from "lucide-react";
import { notifications as seed } from "../../data/adminExtra";
import { Eyebrow, Button } from "../../components/ui/UI";

const iconMap = { order: ShoppingBag, inventory: PackageX, review: Star, payment: CreditCard, ai: Sparkles, customer: User };
const colorMap = { order: "text-emerald-600 bg-emerald-50", inventory: "text-brass-600 bg-brass-100", review: "text-amber-600 bg-amber-50", payment: "text-blue-600 bg-blue-50", ai: "text-violet-600 bg-violet-50", customer: "text-ink/60 bg-ink/6" };

export default function Notifications() {
  const [items, setItems] = useState(seed);
  const markRead = (id) => setItems((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  const markAll = () => setItems((prev) => prev.map((n) => ({ ...n, read: true })));
  const unread = items.filter((n) => !n.read).length;

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <Eyebrow>System</Eyebrow>
          <h1 className="mt-2 font-display text-4xl text-ink">Notifications {unread > 0 && <span className="text-emerald-600">({unread} new)</span>}</h1>
        </div>
        <Button variant="ghost" onClick={markAll}>Mark all as read</Button>
      </div>

      <div className="mt-8 space-y-3">
        {items.map((n) => {
          const Icon = iconMap[n.type];
          return (
            <div key={n.id} className={`flex items-start gap-4 rounded-3xl p-5 shadow-glass ${n.read ? "glass opacity-70" : "glass"}`}>
              <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${colorMap[n.type]}`}>
                <Icon size={17} />
              </span>
              <div className="flex-1">
                <p className="font-display text-base text-ink">{n.title}</p>
                <p className="mt-0.5 text-sm text-ink/60">{n.body}</p>
                <p className="mt-1.5 font-mono text-[11px] text-ink/35">{n.time}</p>
              </div>
              {!n.read && (
                <button onClick={() => markRead(n.id)} aria-label="Mark as read" className="rounded-full p-2 text-ink/40 hover:bg-ink/5 hover:text-emerald-600">
                  <Check size={16} />
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
