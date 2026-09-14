import { useState, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Search, Heart, ShoppingBag, User, Menu, X } from "lucide-react";
import { useStore } from "../../context/StoreContext";

const links = [
  { to: "/shop", label: "Shop" },
  { to: "/shop?category=audio", label: "Audio" },
  { to: "/shop?category=home", label: "Home" },
  { to: "/shop?category=apparel", label: "Apparel" },
  { to: "/shop?tag=flash-deal", label: "Flash deals" },
];

export default function Navbar() {
  const { cartCount, wishlist } = useStore();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const submitSearch = (e) => {
    e.preventDefault();
    navigate(`/shop?q=${encodeURIComponent(query)}`);
    setSearchOpen(false);
    setQuery("");
  };

  return (
    <header className="sticky top-0 z-50">
      <div
        className={`glass-nav transition-shadow duration-300 ${scrolled ? "shadow-glass" : ""}`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-10">
          <Link to="/" className="font-display text-2xl tracking-tight text-ink">
            Lumen
          </Link>

          <nav className="hidden items-center gap-8 lg:flex">
            {links.map((l) => (
              <NavLink
                key={l.label}
                to={l.to}
                className="font-mono text-[12px] uppercase tracking-wider text-ink/70 transition-colors hover:text-ink"
              >
                {l.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setSearchOpen((s) => !s)}
              aria-label="Search"
              className="flex h-10 w-10 items-center justify-center rounded-full text-ink/70 transition-colors hover:bg-ink/5 hover:text-ink"
            >
              <Search size={18} />
            </button>
            <Link
              to="/account"
              aria-label="Account"
              className="hidden h-10 w-10 items-center justify-center rounded-full text-ink/70 transition-colors hover:bg-ink/5 hover:text-ink sm:flex"
            >
              <User size={18} />
            </Link>
            <Link
              to="/wishlist"
              aria-label="Wishlist"
              className="relative flex h-10 w-10 items-center justify-center rounded-full text-ink/70 transition-colors hover:bg-ink/5 hover:text-ink"
            >
              <Heart size={18} />
              {wishlist.length > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 font-mono text-[9px] text-porcelain">
                  {wishlist.length}
                </span>
              )}
            </Link>
            <Link
              to="/cart"
              aria-label="Cart"
              className="relative flex h-10 w-10 items-center justify-center rounded-full text-ink/70 transition-colors hover:bg-ink/5 hover:text-ink"
            >
              <ShoppingBag size={18} />
              {cartCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-brass-500 font-mono text-[9px] text-ink">
                  {cartCount}
                </span>
              )}
            </Link>
            <button
              onClick={() => setOpen(true)}
              aria-label="Menu"
              className="flex h-10 w-10 items-center justify-center rounded-full text-ink/70 transition-colors hover:bg-ink/5 hover:text-ink lg:hidden"
            >
              <Menu size={18} />
            </button>
          </div>
        </div>

        {searchOpen && (
          <div className="border-t border-ink/5 px-6 py-4 lg:px-10">
            <form onSubmit={submitSearch} className="mx-auto flex max-w-2xl items-center gap-3">
              <Search size={18} className="text-ink/40" />
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search products, categories, brands…"
                className="w-full bg-transparent font-sans text-sm text-ink placeholder:text-ink/35 focus:outline-none"
              />
            </form>
          </div>
        )}
      </div>

      {open && (
        <div className="fixed inset-0 z-50 glass-dark lg:hidden">
          <div className="flex items-center justify-between px-6 py-5">
            <span className="font-display text-2xl text-porcelain">Lumen</span>
            <button onClick={() => setOpen(false)} className="text-porcelain" aria-label="Close menu">
              <X size={24} />
            </button>
          </div>
          <nav className="flex flex-col gap-1 px-6 py-4">
            {links.map((l) => (
              <NavLink
                key={l.label}
                to={l.to}
                onClick={() => setOpen(false)}
                className="border-b border-porcelain/10 py-4 font-display text-2xl text-porcelain"
              >
                {l.label}
              </NavLink>
            ))}
            <Link
              to="/account"
              onClick={() => setOpen(false)}
              className="border-b border-porcelain/10 py-4 font-display text-2xl text-porcelain"
            >
              Account
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
