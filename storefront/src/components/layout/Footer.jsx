import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, AtSign, MessageCircle, Play } from "lucide-react";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const submit = (e) => {
    e.preventDefault();
    if (!email) return;
    setSent(true);
    setEmail("");
  };

  return (
    <footer className="relative overflow-hidden bg-ink text-porcelain">
      <div className="pointer-events-none absolute -left-40 top-0 h-96 w-96 rounded-full bg-emerald-500/20 blur-[120px]" />
      <div className="pointer-events-none absolute -right-40 bottom-0 h-96 w-96 rounded-full bg-brass-500/10 blur-[120px]" />

      <div className="relative mx-auto max-w-7xl px-6 py-20 lg:px-10">
        <div className="grid gap-14 lg:grid-cols-[1.3fr_1fr]">
          <div>
            <h3 className="font-display text-4xl leading-tight text-balance">
              Stay ahead of the drop.
            </h3>
            <p className="mt-3 max-w-md text-sm text-porcelain/60">
              One email a week. New arrivals, restocks, and the occasional discount that isn't for everyone.
            </p>
            <form onSubmit={submit} className="mt-6 flex max-w-md items-center gap-3 rounded-full glass-dark p-1.5 pl-5">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@email.com"
                className="w-full bg-transparent text-sm text-porcelain placeholder:text-porcelain/35 focus:outline-none"
              />
              <button
                type="submit"
                aria-label="Subscribe"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-porcelain transition-transform hover:scale-105"
              >
                <ArrowRight size={16} />
              </button>
            </form>
            {sent && <p className="mt-3 font-mono text-xs text-emerald-400">Subscribed. Welcome in.</p>}
          </div>

          <div className="grid grid-cols-2 gap-10 sm:grid-cols-3">
            <div>
              <p className="font-mono text-[11px] uppercase tracking-wider text-porcelain/40">Shop</p>
              <ul className="mt-4 space-y-2.5 text-sm text-porcelain/70">
                <li><Link to="/shop" className="hover:text-porcelain">All products</Link></li>
                <li><Link to="/shop?tag=new" className="hover:text-porcelain">New arrivals</Link></li>
                <li><Link to="/shop?tag=flash-deal" className="hover:text-porcelain">Flash deals</Link></li>
              </ul>
            </div>
            <div>
              <p className="font-mono text-[11px] uppercase tracking-wider text-porcelain/40">Support</p>
              <ul className="mt-4 space-y-2.5 text-sm text-porcelain/70">
                <li><Link to="/account/orders" className="hover:text-porcelain">Track order</Link></li>
                <li><a href="#" className="hover:text-porcelain">Returns</a></li>
                <li><a href="#" className="hover:text-porcelain">Contact us</a></li>
              </ul>
            </div>
            <div>
              <p className="font-mono text-[11px] uppercase tracking-wider text-porcelain/40">Company</p>
              <ul className="mt-4 space-y-2.5 text-sm text-porcelain/70">
                <li><a href="#" className="hover:text-porcelain">About</a></li>
                <li><a href="#" className="hover:text-porcelain">Journal</a></li>
                <li><a href="#" className="hover:text-porcelain">Careers</a></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-16 flex flex-col items-start justify-between gap-6 border-t border-porcelain/10 pt-8 sm:flex-row sm:items-center">
          <p className="font-mono text-[11px] text-porcelain/40">© 2026 Lumen Goods Co.</p>
          <div className="flex items-center gap-4 text-porcelain/50">
            <a href="#" aria-label="Instagram" className="hover:text-porcelain"><AtSign size={16} /></a>
            <a href="#" aria-label="Twitter" className="hover:text-porcelain"><MessageCircle size={16} /></a>
            <a href="#" aria-label="YouTube" className="hover:text-porcelain"><Play size={16} /></a>
          </div>
        </div>
      </div>
    </footer>
  );
}
