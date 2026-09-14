import { Star } from "lucide-react";

export function Button({ children, variant = "primary", className = "", ...props }) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold tracking-wide transition-all duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2";
  const variants = {
    primary:
      "bg-ink text-porcelain hover:bg-emerald-600 hover:shadow-glow-emerald active:scale-[0.98]",
    ghost:
      "bg-transparent text-ink border border-ink/15 hover:border-ink/40 active:scale-[0.98]",
    glass:
      "glass text-ink hover:bg-white/70 shadow-glass active:scale-[0.98]",
    brass:
      "bg-brass-500 text-ink hover:bg-brass-600 hover:shadow-glow-brass active:scale-[0.98]",
  };
  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}

export function Eyebrow({ children, className = "" }) {
  return (
    <span
      className={`font-mono text-[11px] uppercase tracking-[0.22em] text-emerald-600 ${className}`}
    >
      {children}
    </span>
  );
}

export function RatingStars({ rating, size = 14, showValue = true }) {
  return (
    <span className="inline-flex items-center gap-1">
      <span className="inline-flex items-center">
        {Array.from({ length: 5 }, (_, i) => (
          <Star
            key={i}
            size={size}
            className={i < Math.round(rating) ? "fill-brass-500 text-brass-500" : "fill-transparent text-ink/20"}
          />
        ))}
      </span>
      {showValue && <span className="text-xs text-ink/60 font-mono">{rating.toFixed(1)}</span>}
    </span>
  );
}

export function PriceTag({ price, discountPrice, size = "base" }) {
  const sizes = {
    sm: "text-sm",
    base: "text-base",
    lg: "text-2xl",
  };
  if (discountPrice) {
    return (
      <span className={`inline-flex items-baseline gap-2 ${sizes[size]}`}>
        <span className="font-mono font-semibold text-ink">${discountPrice}</span>
        <span className="font-mono text-ink/40 line-through text-[0.85em]">${price}</span>
      </span>
    );
  }
  return <span className={`font-mono font-semibold text-ink ${sizes[size]}`}>${price}</span>;
}
