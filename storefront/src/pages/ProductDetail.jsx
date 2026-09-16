import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Heart, Share2, Minus, Plus, Truck, RotateCcw, ShieldCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { products, reviews as allReviews } from "../data/products";
import { useStore } from "../context/StoreContext";
import { RatingStars, PriceTag, Button, Eyebrow } from "../components/ui/UI";
import ProductCard from "../components/product/ProductCard";

export default function ProductDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const product = products.find((p) => p.slug === slug);
  const { addToCart, toggleWishlist, wishlist, notify } = useStore();

  const [activeImg, setActiveImg] = useState(0);
  const [color, setColor] = useState(product?.colors?.[0]);
  const [size, setSize] = useState(product?.sizes?.[0]);
  const [qty, setQty] = useState(1);
  const [tab, setTab] = useState("description");

  useEffect(() => {
    window.scrollTo(0, 0);
    setActiveImg(0);
    setColor(product?.colors?.[0]);
    setSize(product?.sizes?.[0]);
    setQty(1);
  }, [slug]);

  if (!product) {
    return (
      <div className="mx-auto max-w-xl px-6 py-32 text-center">
        <h1 className="font-display text-3xl text-ink">Product not found</h1>
        <button onClick={() => navigate("/shop")} className="mt-6 font-mono text-sm text-emerald-600 underline">
          Back to shop
        </button>
      </div>
    );
  }

  const productReviews = allReviews.filter((r) => r.productId === product.id);
  const similar = products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4);
  const saved = wishlist.includes(product.id);

  const share = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: product.name, url: window.location.href });
      } catch {}
    } else {
      notify("Link copied to clipboard");
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-6 py-10 lg:px-10">
      <nav className="font-mono text-[11px] uppercase tracking-wider text-ink/40">
        <Link to="/shop" className="hover:text-ink">Shop</Link> /{" "}
        <Link to={`/shop?category=${product.category}`} className="capitalize hover:text-ink">{product.category}</Link> /{" "}
        <span className="text-ink/60">{product.name}</span>
      </nav>

      <div className="mt-6 grid gap-12 lg:grid-cols-2">
        {/* Gallery */}
        <div>
          <div className="relative aspect-square overflow-hidden rounded-4xl bg-ink-700">
            <AnimatePresence mode="wait">
              <motion.img
                key={activeImg}
                src={product.images[activeImg]}
                alt={product.name}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="h-full w-full object-cover"
              />
            </AnimatePresence>
          </div>
          <div className="mt-4 grid grid-cols-4 gap-3">
            {product.images.map((img, i) => (
              <button
                key={i}
                onClick={() => setActiveImg(i)}
                className={`aspect-square overflow-hidden rounded-2xl ring-2 transition-all ${
                  activeImg === i ? "ring-emerald-600" : "ring-transparent opacity-70 hover:opacity-100"
                }`}
              >
                <img src={img} alt="" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Info */}
        <div>
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="font-mono text-[11px] uppercase tracking-wider text-emerald-600">{product.brand}</p>
              <h1 className="mt-1 font-display text-4xl text-ink">{product.name}</h1>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => toggleWishlist(product)}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-ink/15 hover:border-ink/40"
                aria-label="Toggle wishlist"
              >
                <Heart size={18} className={saved ? "fill-emerald-500 text-emerald-500" : "text-ink"} />
              </button>
              <button
                onClick={share}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-ink/15 hover:border-ink/40"
                aria-label="Share product"
              >
                <Share2 size={18} className="text-ink" />
              </button>
            </div>
          </div>

          <div className="mt-3 flex items-center gap-3">
            <RatingStars rating={product.rating} />
            <span className="text-xs text-ink/40">({product.reviewCount} reviews)</span>
          </div>

          <div className="mt-5">
            <PriceTag price={product.price} discountPrice={product.discountPrice} size="lg" />
          </div>

          <p className="mt-5 max-w-md text-sm leading-relaxed text-ink/65">{product.short}</p>

          {product.colors?.length > 0 && (
            <div className="mt-7">
              <p className="font-mono text-[11px] uppercase tracking-wider text-ink/45">
                Color — <span className="text-ink">{color}</span>
              </p>
              <div className="mt-2.5 flex gap-2.5">
                {product.colors.map((c) => (
                  <button
                    key={c}
                    onClick={() => setColor(c)}
                    className={`rounded-full border px-4 py-2 text-xs font-medium ${
                      color === c ? "border-ink bg-ink text-porcelain" : "border-ink/15 text-ink/70 hover:border-ink/40"
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          )}

          {product.sizes?.length > 0 && (
            <div className="mt-6">
              <p className="font-mono text-[11px] uppercase tracking-wider text-ink/45">
                Size — <span className="text-ink">{size}</span>
              </p>
              <div className="mt-2.5 flex flex-wrap gap-2.5">
                {product.sizes.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSize(s)}
                    className={`h-10 min-w-10 rounded-full border px-3 text-xs font-medium ${
                      size === s ? "border-ink bg-ink text-porcelain" : "border-ink/15 text-ink/70 hover:border-ink/40"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="mt-8 flex items-center gap-4">
            <div className="flex items-center rounded-full border border-ink/15">
              <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="p-3" aria-label="Decrease quantity">
                <Minus size={14} />
              </button>
              <span className="w-8 text-center font-mono text-sm">{qty}</span>
              <button onClick={() => setQty((q) => Math.min(product.stock, q + 1))} className="p-3" aria-label="Increase quantity">
                <Plus size={14} />
              </button>
            </div>
            <p className="font-mono text-xs text-ink/40">{product.stock} in stock</p>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <Button variant="ghost" className="flex-1" onClick={() => addToCart(product, { qty, color, size })}>
              Add to cart
            </Button>
            <Button
              variant="primary"
              className="flex-1"
              onClick={() => {
                addToCart(product, { qty, color, size });
                navigate("/checkout");
              }}
            >
              Buy now
            </Button>
          </div>

          <div className="mt-8 grid grid-cols-3 gap-3 border-t border-ink/8 pt-6">
            <Feature icon={<Truck size={16} />} label="Free shipping over $75" />
            <Feature icon={<RotateCcw size={16} />} label="30-day returns" />
            <Feature icon={<ShieldCheck size={16} />} label="2-year warranty" />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-20 border-b border-ink/8">
        <div className="flex gap-8">
          {[
            { id: "description", label: "Description" },
            { id: "specs", label: "Specifications" },
            { id: "reviews", label: `Reviews (${productReviews.length})` },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`border-b-2 pb-4 font-mono text-xs uppercase tracking-wider transition-colors ${
                tab === t.id ? "border-emerald-600 text-ink" : "border-transparent text-ink/40 hover:text-ink/70"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-2xl py-10">
        {tab === "description" && <p className="text-sm leading-relaxed text-ink/70">{product.description}</p>}
        {tab === "specs" && (
          <dl className="grid grid-cols-2 gap-y-4 text-sm">
            <dt className="text-ink/45">SKU</dt>
            <dd className="font-mono text-ink">{product.sku}</dd>
            <dt className="text-ink/45">Category</dt>
            <dd className="capitalize text-ink">{product.category}</dd>
            <dt className="text-ink/45">Brand</dt>
            <dd className="text-ink">{product.brand}</dd>
            <dt className="text-ink/45">Availability</dt>
            <dd className="text-ink">{product.stock > 0 ? "In stock" : "Out of stock"}</dd>
          </dl>
        )}
        {tab === "reviews" && (
          <div className="space-y-6">
            {productReviews.length === 0 && (
              <p className="text-sm text-ink/50">No reviews yet for this product.</p>
            )}
            {productReviews.map((r) => (
              <div key={r.id} className="rounded-3xl glass p-6 shadow-glass">
                <div className="flex items-center justify-between">
                  <p className="font-display text-base text-ink">{r.title}</p>
                  <RatingStars rating={r.rating} showValue={false} size={13} />
                </div>
                <p className="mt-2 text-sm text-ink/65">{r.body}</p>
                <p className="mt-3 font-mono text-[11px] uppercase tracking-wider text-ink/40">
                  {r.name} · {r.date}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Similar products */}
      {similar.length > 0 && (
        <div className="border-t border-ink/8 py-16">
          <Eyebrow>You might also like</Eyebrow>
          <h2 className="mt-2 font-display text-3xl text-ink">Similar products</h2>
          <div className="mt-8 grid grid-cols-2 gap-x-5 gap-y-10 sm:grid-cols-4">
            {similar.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function Feature({ icon, label }) {
  return (
    <div className="flex flex-col items-center gap-2 text-center">
      <span className="text-emerald-600">{icon}</span>
      <p className="font-mono text-[10px] uppercase tracking-wide text-ink/50">{label}</p>
    </div>
  );
}
