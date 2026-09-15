import { useEffect, useState } from "react";
import { Timer } from "lucide-react";
import ProductCard from "../product/ProductCard";
import { Eyebrow } from "../ui/UI";

function useCountdown(hours = 6) {
  const [target] = useState(() => Date.now() + hours * 3600 * 1000);
  const [remaining, setRemaining] = useState(target - Date.now());

  useEffect(() => {
    const t = setInterval(() => setRemaining(Math.max(0, target - Date.now())), 1000);
    return () => clearInterval(t);
  }, [target]);

  const h = Math.floor(remaining / 3600000);
  const m = Math.floor((remaining % 3600000) / 60000);
  const s = Math.floor((remaining % 60000) / 1000);
  return { h, m, s };
}

export default function FlashDeals({ products }) {
  const { h, m, s } = useCountdown(6);
  const pad = (n) => String(n).padStart(2, "0");

  return (
    <section className="relative overflow-hidden bg-emerald-900 px-6 py-24 lg:px-10">
      <div className="pointer-events-none absolute -left-20 top-1/2 h-80 w-80 -translate-y-1/2 rounded-full bg-brass-500/20 blur-[120px]" />
      <div className="relative mx-auto max-w-7xl">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <Eyebrow className="text-brass-300">Limited time</Eyebrow>
            <h2 className="mt-2 font-display text-4xl text-porcelain">Flash deals</h2>
          </div>
          <div className="flex items-center gap-2 rounded-full glass-dark px-5 py-2.5 text-porcelain">
            <Timer size={16} className="text-brass-300" />
            <span className="font-mono text-sm tabular-nums">
              {pad(h)}:{pad(m)}:{pad(s)}
            </span>
            <span className="font-mono text-[11px] uppercase tracking-wider text-porcelain/50">left</span>
          </div>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-x-5 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
          {products.map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
