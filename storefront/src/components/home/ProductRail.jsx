import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import ProductCard from "../product/ProductCard";
import { Eyebrow } from "../ui/UI";

export default function ProductRail({ eyebrow, title, products, viewAllHref = "/shop", dark = false }) {
  return (
    <section className={`${dark ? "bg-ink" : ""} px-6 py-24 lg:px-10`}>
      <div className="mx-auto max-w-7xl">
        <div className="flex items-end justify-between">
          <div>
            <Eyebrow className={dark ? "text-emerald-400" : ""}>{eyebrow}</Eyebrow>
            <h2 className={`mt-2 font-display text-4xl ${dark ? "text-porcelain" : "text-ink"}`}>{title}</h2>
          </div>
          <Link
            to={viewAllHref}
            className={`hidden items-center gap-1.5 font-mono text-xs uppercase tracking-wider sm:flex ${
              dark ? "text-porcelain/60 hover:text-porcelain" : "text-ink/60 hover:text-ink"
            }`}
          >
            View all <ArrowRight size={14} />
          </Link>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-x-5 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
          {products.slice(0, 4).map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
