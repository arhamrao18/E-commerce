import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { CreditCard, Lock, CheckCircle2, Truck } from "lucide-react";
import { useStore } from "../context/StoreContext";
import { products } from "../data/products";
import { Button, Eyebrow } from "../components/ui/UI";

const STEPS = ["Shipping", "Payment", "Review"];

export default function Checkout() {
  const { cart } = useStore();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [placed, setPlaced] = useState(false);
  const [orderId] = useState(() => `LM-${Math.floor(100000 + Math.random() * 900000)}`);

  const lines = cart
    .map((item) => ({ ...item, product: products.find((p) => p.id === item.productId) }))
    .filter((l) => l.product);
  const subtotal = lines.reduce((sum, l) => sum + (l.product.discountPrice || l.product.price) * l.qty, 0);
  const shipping = subtotal > 75 || subtotal === 0 ? 0 : 8;
  const tax = Math.round(subtotal * 0.08);
  const total = subtotal + shipping + tax;

  if (lines.length === 0 && !placed) {
    return (
      <div className="mx-auto max-w-xl px-6 py-32 text-center">
        <h1 className="font-display text-3xl text-ink">Nothing to check out</h1>
        <Link to="/shop">
          <Button className="mt-8">Go to shop</Button>
        </Link>
      </div>
    );
  }

  if (placed) {
    return (
      <div className="mx-auto flex max-w-xl flex-col items-center px-6 py-32 text-center">
        <motion.div initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
          <CheckCircle2 size={56} className="text-emerald-600" />
        </motion.div>
        <h1 className="mt-6 font-display text-4xl text-ink">Order confirmed</h1>
        <p className="mt-3 text-sm text-ink/60">
          Order <span className="font-mono text-ink">{orderId}</span> is being prepared. A receipt was sent to your email.
        </p>
        <div className="mt-8 w-full rounded-3xl glass p-6 text-left shadow-glass">
          <Row label="Subtotal" value={`$${subtotal}`} />
          <Row label="Shipping" value={shipping === 0 ? "Free" : `$${shipping}`} />
          <Row label="Tax" value={`$${tax}`} />
          <div className="mt-3 flex justify-between border-t border-ink/10 pt-3 font-display text-lg text-ink">
            <span>Total paid</span>
            <span className="font-mono">${total}</span>
          </div>
        </div>
        <div className="mt-8 flex gap-3">
          <Link to="/account/orders"><Button variant="ghost">Track order</Button></Link>
          <Link to="/shop"><Button>Continue shopping</Button></Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-14 lg:px-10">
      <Eyebrow>Checkout</Eyebrow>
      <h1 className="mt-2 font-display text-4xl text-ink">Complete your order</h1>

      <div className="mt-8 flex items-center gap-3">
        {STEPS.map((s, i) => (
          <div key={s} className="flex items-center gap-3">
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full font-mono text-xs ${
                i <= step ? "bg-emerald-600 text-porcelain" : "bg-ink/8 text-ink/40"
              }`}
            >
              {i + 1}
            </div>
            <span className={`font-mono text-xs uppercase tracking-wider ${i <= step ? "text-ink" : "text-ink/35"}`}>{s}</span>
            {i < STEPS.length - 1 && <div className="h-px w-8 bg-ink/10 sm:w-16" />}
          </div>
        ))}
      </div>

      <div className="mt-10 grid gap-12 lg:grid-cols-[1fr_360px]">
        <div>
          {step === 0 && <ShippingForm onNext={() => setStep(1)} />}
          {step === 1 && <PaymentForm onBack={() => setStep(0)} onNext={() => setStep(2)} />}
          {step === 2 && <ReviewStep onBack={() => setStep(1)} onPlace={() => setPlaced(true)} lines={lines} />}
        </div>

        <div className="h-fit rounded-4xl glass p-7 shadow-glass-lg">
          <h2 className="font-display text-xl text-ink">Order summary</h2>
          <div className="mt-5 max-h-60 space-y-4 overflow-y-auto pr-1">
            {lines.map((l) => (
              <div key={`${l.productId}-${l.color}-${l.size}`} className="flex items-center gap-3">
                <img src={l.product.images[0]} alt="" className="h-14 w-12 rounded-xl object-cover" />
                <div className="flex-1">
                  <p className="text-sm text-ink">{l.product.name}</p>
                  <p className="font-mono text-xs text-ink/40">Qty {l.qty}</p>
                </div>
                <p className="font-mono text-sm text-ink">${(l.product.discountPrice || l.product.price) * l.qty}</p>
              </div>
            ))}
          </div>
          <div className="mt-5 space-y-2 border-t border-ink/8 pt-4 text-sm">
            <Row label="Subtotal" value={`$${subtotal}`} />
            <Row label="Shipping" value={shipping === 0 ? "Free" : `$${shipping}`} />
            <Row label="Tax" value={`$${tax}`} />
          </div>
          <div className="mt-4 flex items-center justify-between border-t border-ink/8 pt-4">
            <p className="font-display text-lg text-ink">Total</p>
            <p className="font-mono text-xl font-semibold text-ink">${total}</p>
          </div>
          <p className="mt-4 flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-ink/35">
            <Lock size={11} /> Secured checkout
          </p>
        </div>
      </div>
    </div>
  );
}

function Field({ label, ...props }) {
  return (
    <label className="block">
      <span className="font-mono text-[11px] uppercase tracking-wider text-ink/45">{label}</span>
      <input
        required
        {...props}
        className="mt-1.5 w-full rounded-xl border border-ink/15 bg-white/50 px-4 py-3 text-sm text-ink placeholder:text-ink/30 focus:border-emerald-600 focus:outline-none"
      />
    </label>
  );
}

function ShippingForm({ onNext }) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onNext();
      }}
      className="space-y-5"
    >
      <div className="flex items-center gap-2 text-emerald-700">
        <Truck size={16} />
        <p className="font-mono text-xs uppercase tracking-wider">Shipping address</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="First name" placeholder="Jordan" />
        <Field label="Last name" placeholder="Ellis" />
      </div>
      <Field label="Email" type="email" placeholder="you@email.com" />
      <Field label="Address" placeholder="123 Market Street" />
      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="City" placeholder="Portland" />
        <Field label="State" placeholder="OR" />
        <Field label="ZIP" placeholder="97201" />
      </div>
      <label className="flex items-center gap-2 text-sm text-ink/60">
        <input type="checkbox" defaultChecked className="h-3.5 w-3.5 accent-emerald-600" />
        Billing address same as shipping
      </label>
      <Button type="submit" className="w-full sm:w-auto">Continue to payment</Button>
    </form>
  );
}

function PaymentForm({ onBack, onNext }) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onNext();
      }}
      className="space-y-5"
    >
      <div className="flex items-center gap-2 text-emerald-700">
        <CreditCard size={16} />
        <p className="font-mono text-xs uppercase tracking-wider">Payment details</p>
      </div>
      <Field label="Card number" placeholder="4242 4242 4242 4242" inputMode="numeric" />
      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="Expiry" placeholder="MM/YY" />
        <Field label="CVC" placeholder="123" />
        <Field label="ZIP" placeholder="97201" />
      </div>
      <p className="font-mono text-[10px] text-ink/35">
        Payments are processed securely and card details are never stored on our servers.
      </p>
      <div className="flex gap-3">
        <Button type="button" variant="ghost" onClick={onBack}>Back</Button>
        <Button type="submit">Review order</Button>
      </div>
    </form>
  );
}

function ReviewStep({ onBack, onPlace, lines }) {
  return (
    <div className="space-y-6">
      <p className="font-mono text-xs uppercase tracking-wider text-emerald-700">Review & place order</p>
      <p className="text-sm text-ink/60">
        You're about to place an order for {lines.length} item{lines.length > 1 ? "s" : ""}. Shipping to the address
        provided, paid with the card ending in 4242.
      </p>
      <div className="flex gap-3">
        <Button variant="ghost" onClick={onBack}>Back</Button>
        <Button onClick={onPlace}>Place order</Button>
      </div>
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex justify-between">
      <span className="text-ink/55">{label}</span>
      <span className="font-mono text-ink">{value}</span>
    </div>
  );
}
