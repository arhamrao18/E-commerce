import { useState } from "react";
import { Link } from "react-router-dom";
import { Minus, Plus, X, ArrowRight, Tag } from "lucide-react";
import { useStore } from "../context/StoreContext";
import { products } from "../data/products";
import { Button, Eyebrow } from "../components/ui/UI";

export default function Cart() {
  const { cart, updateQty, removeFromCart } = useStore();
  const [coupon, setCoupon] = useState("");
  const [applied, setApplied] = useState(null);

  const lines = cart
    .map((item) => ({ ...item, product: products.find((p) => p.id === item.productId) }))
    .filter((l) => l.product);

  const subtotal = lines.reduce((sum, l) => sum + (l.product.discountPrice || l.product.price) * l.qty, 0);
  const discount = applied ? Math.round(subtotal * 0.1) : 0;
  const shipping = subtotal > 75 || subtotal === 0 ? 0 : 8;
  const tax = Math.round((subtotal - discount) * 0.08);
  const total = subtotal - discount + shipping + tax;

  const applyCoupon = (e) => {
    e.preventDefault();
    if (coupon.trim().toUpperCase() === "LUMEN10") setApplied("LUMEN10");
  };

  if (lines.length === 0) {
    return (
      <div className="mx-auto max-w-xl px-6 py-32 text-center">
        <h1 className="font-display text-3xl text-ink">Your cart is empty</h1>
        <p className="mt-2 text-sm text-ink/50">Add something you'll actually use.</p>
        <Link to="/shop">
          <Button className="mt-8">Continue shopping</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-14 lg:px-10">
      <Eyebrow>Cart</Eyebrow>
      <h1 className="mt-2 font-display text-4xl text-ink">Your bag ({lines.length})</h1>

      <div className="mt-10 grid gap-12 lg:grid-cols-[1fr_380px]">
        <div className="divide-y divide-ink/8">
          {lines.map((l) => (
            <div key={`${l.productId}-${l.color}-${l.size}`} className="flex gap-5 py-6">
              <Link to={`/product/${l.product.slug}`} className="h-28 w-24 shrink-0 overflow-hidden rounded-2xl bg-ink-700">
                <img src={l.product.images[0]} alt={l.product.name} className="h-full w-full object-cover" />
              </Link>
              <div className="flex flex-1 flex-col justify-between">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <Link to={`/product/${l.product.slug}`} className="font-display text-lg text-ink hover:text-emerald-700">
                      {l.product.name}
                    </Link>
                    <p className="mt-0.5 font-mono text-xs text-ink/45">
                      {[l.color, l.size].filter(Boolean).join(" · ") || l.product.brand}
                    </p>
                  </div>
                  <button
                    onClick={() => removeFromCart(l.productId, l.color, l.size)}
                    aria-label="Remove item"
                    className="text-ink/40 hover:text-ink"
                  >
                    <X size={18} />
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center rounded-full border border-ink/15">
                    <button
                      onClick={() => updateQty(l.productId, l.color, l.size, l.qty - 1)}
                      className="p-2.5"
                      aria-label="Decrease quantity"
                    >
                      <Minus size={13} />
                    </button>
                    <span className="w-7 text-center font-mono text-sm">{l.qty}</span>
                    <button
                      onClick={() => updateQty(l.productId, l.color, l.size, l.qty + 1)}
                      className="p-2.5"
                      aria-label="Increase quantity"
                    >
                      <Plus size={13} />
                    </button>
                  </div>
                  <p className="font-mono text-sm font-semibold text-ink">
                    ${(l.product.discountPrice || l.product.price) * l.qty}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="h-fit rounded-4xl glass p-7 shadow-glass-lg">
          <h2 className="font-display text-xl text-ink">Order summary</h2>

          <form onSubmit={applyCoupon} className="mt-5 flex items-center gap-2 rounded-full border border-ink/15 p-1.5 pl-4">
            <Tag size={15} className="text-ink/40" />
            <input
              value={coupon}
              onChange={(e) => setCoupon(e.target.value)}
              placeholder="Coupon code (try LUMEN10)"
              className="w-full bg-transparent text-sm placeholder:text-ink/35 focus:outline-none"
            />
            <button type="submit" className="rounded-full bg-ink px-4 py-2 font-mono text-xs text-porcelain">
              Apply
            </button>
          </form>
          {applied && <p className="mt-2 font-mono text-xs text-emerald-600">LUMEN10 applied — 10% off</p>}

          <div className="mt-6 space-y-3 border-t border-ink/8 pt-5 text-sm">
            <Row label="Subtotal" value={`$${subtotal}`} />
            {applied && <Row label="Discount" value={`-$${discount}`} highlight />}
            <Row label="Shipping" value={shipping === 0 ? "Free" : `$${shipping}`} />
            <Row label="Estimated tax" value={`$${tax}`} />
          </div>

          <div className="mt-5 flex items-center justify-between border-t border-ink/8 pt-5">
            <p className="font-display text-lg text-ink">Total</p>
            <p className="font-mono text-xl font-semibold text-ink">${total}</p>
          </div>

          <Link to="/checkout">
            <Button className="mt-6 w-full">
              Checkout <ArrowRight size={15} />
            </Button>
          </Link>
          <Link to="/shop" className="mt-3 block text-center font-mono text-xs text-ink/50 underline">
            Continue shopping
          </Link>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value, highlight }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-ink/55">{label}</span>
      <span className={`font-mono ${highlight ? "text-emerald-600" : "text-ink"}`}>{value}</span>
    </div>
  );
}
