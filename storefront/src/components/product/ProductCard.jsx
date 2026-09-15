import { Link } from "react-router-dom";
import { Heart } from "lucide-react";
import { motion } from "framer-motion";
import { useStore } from "../../context/StoreContext";
import { RatingStars, PriceTag } from "../ui/UI";

export default function ProductCard({ product, index = 0 }) {
  const { toggleWishlist, wishlist, addToCart } = useStore();
  const saved = wishlist.includes(product.id);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay: (index % 4) * 0.06 }}
      className="group relative"
    >
      <Link to={`/product/${product.slug}`} className="block">
        <div className="relative aspect-[4/5] overflow-hidden rounded-3xl bg-ink-700">
          <img
            src={product.images[0]}
            alt={product.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/40 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

          {product.tags.includes("flash-deal") && (
            <span className="absolute left-3 top-3 rounded-full bg-brass-500 px-3 py-1 font-mono text-[10px] uppercase tracking-wider text-ink">
              Flash deal
            </span>
          )}
          {!product.tags.includes("flash-deal") && product.tags.includes("new") && (
            <span className="absolute left-3 top-3 rounded-full bg-porcelain px-3 py-1 font-mono text-[10px] uppercase tracking-wider text-ink">
              New
            </span>
          )}

          <button
            onClick={(e) => {
              e.preventDefault();
              toggleWishlist(product);
            }}
            aria-label={saved ? "Remove from wishlist" : "Save to wishlist"}
            className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full glass shadow-glass transition-transform duration-300 hover:scale-110"
          >
            <Heart size={16} className={saved ? "fill-emerald-500 text-emerald-500" : "text-ink"} />
          </button>

          <div className="absolute inset-x-3 bottom-3 translate-y-3 opacity-0 transition-all duration-400 group-hover:translate-y-0 group-hover:opacity-100">
            <button
              onClick={(e) => {
                e.preventDefault();
                addToCart(product);
              }}
              className="w-full rounded-full glass py-2.5 text-xs font-semibold uppercase tracking-wider text-ink shadow-glass hover:bg-white/80"
            >
              Quick add
            </button>
          </div>
        </div>

        <div className="mt-4 space-y-1">
          <div className="flex items-center justify-between gap-2">
            <p className="font-mono text-[11px] uppercase tracking-wider text-ink/45">{product.brand}</p>
            <RatingStars rating={product.rating} showValue={false} size={12} />
          </div>
          <h3 className="font-display text-lg text-ink">{product.name}</h3>
          <PriceTag price={product.price} discountPrice={product.discountPrice} />
        </div>
      </Link>
    </motion.div>
  );
}
