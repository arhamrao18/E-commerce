import { NavLink, Link, Outlet } from "react-router-dom";
import {
  LayoutDashboard, Package, ShoppingCart, Users, Settings, ArrowLeft,
  Tags, TicketPercent, Star, Sparkles, TrendingUp, ShieldAlert,
  Bell, History, KeyRound, FolderTree,
} from "lucide-react";

const GROUPS = [
  {
    label: "Store",
    items: [
      { to: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true },
      { to: "/admin/products", label: "Products", icon: Package },
      { to: "/admin/categories", label: "Categories", icon: FolderTree },
      { to: "/admin/orders", label: "Orders", icon: ShoppingCart },
      { to: "/admin/coupons", label: "Coupons", icon: TicketPercent },
      { to: "/admin/reviews", label: "Reviews", icon: Star },
      { to: "/admin/customers", label: "Customers", icon: Users },
    ],
  },
  {
    label: "Intelligence",
    badge: "AI",
    items: [
      { to: "/admin/ai-assistant", label: "AI Assistant", icon: Sparkles },
      { to: "/admin/sales-intelligence", label: "Sales Intelligence", icon: TrendingUp },
      { to: "/admin/inventory-prediction", label: "Inventory Prediction", icon: Package },
      { to: "/admin/fraud-detection", label: "Fraud Detection", icon: ShieldAlert },
    ],
  },
  {
    label: "System",
    items: [
      { to: "/admin/notifications", label: "Notifications", icon: Bell },
      { to: "/admin/activity-log", label: "Activity log", icon: History },
      { to: "/admin/roles", label: "Roles & permissions", icon: KeyRound },
      { to: "/admin/settings", label: "Settings", icon: Settings },
    ],
  },
];

export default function AdminLayout() {
  return (
    <div className="flex min-h-screen bg-porcelain-100">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col overflow-y-auto border-r border-ink/8 bg-ink px-4 py-6 lg:flex">
        <Link to="/" className="flex items-center gap-2 px-2">
          <span className="font-display text-xl text-porcelain">Lumen</span>
          <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider text-emerald-400">
            Admin
          </span>
        </Link>

        <nav className="mt-8 flex-1 space-y-6">
          {GROUPS.map((g) => (
            <div key={g.label}>
              <div className="flex items-center gap-2 px-3">
                <p className="font-mono text-[10px] uppercase tracking-wider text-porcelain/30">{g.label}</p>
                {g.badge && (
                  <span className="rounded-full bg-brass-500/20 px-1.5 py-0.5 font-mono text-[9px] text-brass-300">{g.badge}</span>
                )}
              </div>
              <div className="mt-2 space-y-1">
                {g.items.map((n) => (
                  <NavLink
                    key={n.to}
                    to={n.to}
                    end={n.end}
                    className={({ isActive }) =>
                      `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors ${
                        isActive ? "bg-emerald-500/15 text-emerald-400" : "text-porcelain/55 hover:bg-white/5 hover:text-porcelain"
                      }`
                    }
                  >
                    <n.icon size={16} />
                    {n.label}
                  </NavLink>
                ))}
              </div>
            </div>
          ))}
        </nav>

        <Link
          to="/"
          className="mt-4 flex items-center gap-2 rounded-xl px-3 py-2.5 font-mono text-[11px] uppercase tracking-wider text-porcelain/40 hover:text-porcelain"
        >
          <ArrowLeft size={14} /> Back to storefront
        </Link>
      </aside>

      <div className="flex-1 lg:pl-64">
        <div className="flex items-center justify-between border-b border-ink/8 bg-ink px-5 py-4 lg:hidden">
          <Link to="/" className="font-display text-lg text-porcelain">Lumen Admin</Link>
        </div>
        <div className="mx-auto max-w-7xl px-6 py-10 lg:px-10">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
