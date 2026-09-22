import { useState } from "react";
import { Check, X, Flag, Star as StarIcon } from "lucide-react";
import { reviewQueue } from "../../data/adminExtra";
import { Eyebrow } from "../../components/ui/UI";

const tabs = ["Pending", "Approved", "Featured", "Flagged"];

export default function Reviews() {
  const [reviews, setReviews] = useState(reviewQueue);
  const [tab, setTab] = useState("Pending");

  const setStatus = (id, status) => setReviews((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));

  const filtered = reviews.filter((r) => (tab === "Flagged" ? r.flagged : r.status === tab));

  return (
    <div>
      <Eyebrow>Community</Eyebrow>
      <h1 className="mt-2 font-display text-4xl text-ink">Reviews</h1>

      <div className="mt-6 flex gap-2">
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`rounded-full px-4 py-2 font-mono text-xs uppercase tracking-wider ${
              tab === t ? "bg-ink text-porcelain" : "bg-white/50 text-ink/50 border border-ink/10"
            }`}
          >
            {t} ({t === "Flagged" ? reviews.filter((r) => r.flagged).length : reviews.filter((r) => r.status === t).length})
          </button>
        ))}
      </div>

      <div className="mt-6 space-y-4">
        {filtered.length === 0 && <p className="py-10 text-center text-ink/40">Nothing here right now.</p>}
        {filtered.map((r) => (
          <div key={r.id} className="rounded-3xl glass p-6 shadow-glass">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-display text-lg text-ink">{r.product}</p>
                <p className="font-mono text-[11px] text-ink/40">{r.customer} · {r.date}</p>
              </div>
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }, (_, i) => (
                  <StarIcon key={i} size={13} className={i < r.rating ? "fill-brass-500 text-brass-500" : "text-ink/15"} />
                ))}
              </div>
            </div>
            <p className="mt-3 text-sm text-ink/70">{r.body}</p>
            {r.flagged && (
              <p className="mt-2 flex items-center gap-1.5 font-mono text-[11px] text-red-600"><Flag size={12} /> Flagged by spam filter</p>
            )}
            <div className="mt-4 flex gap-2">
              <button onClick={() => setStatus(r.id, "Approved")} className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 font-mono text-[11px] text-emerald-700"><Check size={12} /> Approve</button>
              <button onClick={() => setStatus(r.id, "Featured")} className="flex items-center gap-1.5 rounded-full bg-brass-100 px-3 py-1.5 font-mono text-[11px] text-brass-600"><StarIcon size={12} /> Feature</button>
              <button onClick={() => setStatus(r.id, "Rejected")} className="flex items-center gap-1.5 rounded-full bg-red-50 px-3 py-1.5 font-mono text-[11px] text-red-600"><X size={12} /> Reject</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
