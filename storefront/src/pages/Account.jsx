import { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import { User, Package, MapPin, Bell, Lock, Heart } from "lucide-react";
import { Eyebrow, Button, RatingStars } from "../components/ui/UI";
import { products } from "../data/products";

const NAV = [
  { id: "profile", label: "Profile", icon: User },
  { id: "orders", label: "Orders", icon: Package },
  { id: "addresses", label: "Addresses", icon: MapPin },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "security", label: "Password & security", icon: Lock },
];

const mockOrders = [
  { id: "LM-482913", date: "Jul 14, 2026", status: "Delivered", total: 199, items: [products[0]] },
  { id: "LM-481207", date: "Jun 28, 2026", status: "Shipped", total: 358, items: [products[2], products[4]] },
  { id: "LM-479002", date: "Jun 02, 2026", status: "Processing", total: 89, items: [products[9]] },
];

const statusColor = {
  Delivered: "text-emerald-700 bg-emerald-50",
  Shipped: "text-brass-600 bg-brass-100",
  Processing: "text-ink/60 bg-ink/5",
  Cancelled: "text-red-600 bg-red-50",
};

export default function Account() {
  const [tab, setTab] = useState("profile");

  return (
    <div className="mx-auto max-w-7xl px-6 py-14 lg:px-10">
      <Eyebrow>Account</Eyebrow>
      <h1 className="mt-2 font-display text-4xl text-ink">Hi, Jordan</h1>

      <div className="mt-10 grid gap-10 lg:grid-cols-[220px_1fr]">
        <aside className="space-y-1">
          {NAV.map((n) => (
            <button
              key={n.id}
              onClick={() => setTab(n.id)}
              className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm transition-colors ${
                tab === n.id ? "bg-ink text-porcelain" : "text-ink/60 hover:bg-ink/5"
              }`}
            >
              <n.icon size={16} /> {n.label}
            </button>
          ))}
          <Link
            to="/wishlist"
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm text-ink/60 hover:bg-ink/5"
          >
            <Heart size={16} /> Wishlist
          </Link>
        </aside>

        <div>
          {tab === "profile" && <Profile />}
          {tab === "orders" && <Orders />}
          {tab === "addresses" && <Addresses />}
          {tab === "notifications" && <Notifications />}
          {tab === "security" && <Security />}
        </div>
      </div>
    </div>
  );
}

function Card({ title, children }) {
  return (
    <div className="rounded-4xl glass p-8 shadow-glass">
      <h2 className="font-display text-2xl text-ink">{title}</h2>
      <div className="mt-6">{children}</div>
    </div>
  );
}

function Input({ label, ...props }) {
  return (
    <label className="block">
      <span className="font-mono text-[11px] uppercase tracking-wider text-ink/45">{label}</span>
      <input
        {...props}
        className="mt-1.5 w-full rounded-xl border border-ink/15 bg-white/50 px-4 py-3 text-sm text-ink focus:border-emerald-600 focus:outline-none"
      />
    </label>
  );
}

function Profile() {
  return (
    <Card title="Profile">
      <div className="grid gap-5 sm:grid-cols-2">
        <Input label="First name" defaultValue="Jordan" />
        <Input label="Last name" defaultValue="Ellis" />
        <Input label="Email" defaultValue="jordan@email.com" type="email" />
        <Input label="Phone" defaultValue="+1 (555) 019-2231" />
      </div>
      <Button className="mt-7">Save changes</Button>
    </Card>
  );
}

function Orders() {
  return (
    <div className="space-y-4">
      {mockOrders.map((o) => (
        <div key={o.id} className="rounded-3xl glass p-6 shadow-glass">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="font-mono text-sm text-ink">{o.id}</p>
              <p className="font-mono text-xs text-ink/40">{o.date}</p>
            </div>
            <span className={`rounded-full px-3 py-1 font-mono text-[11px] ${statusColor[o.status]}`}>{o.status}</span>
          </div>
          <div className="mt-4 flex items-center gap-3">
            {o.items.map((p) => (
              <img key={p.id} src={p.images[0]} alt={p.name} className="h-14 w-12 rounded-xl object-cover" />
            ))}
            <p className="text-sm text-ink/60">
              {o.items.map((p) => p.name).join(", ")}
            </p>
          </div>
          <div className="mt-4 flex items-center justify-between border-t border-ink/8 pt-4">
            <p className="font-mono text-sm font-semibold text-ink">${o.total}</p>
            <button className="font-mono text-xs uppercase tracking-wider text-emerald-600 underline">View invoice</button>
          </div>
        </div>
      ))}
    </div>
  );
}

function Addresses() {
  return (
    <Card title="Saved addresses">
      <div className="grid gap-4 sm:grid-cols-2">
        {["Home", "Office"].map((label) => (
          <div key={label} className="rounded-2xl border border-ink/10 p-5">
            <p className="font-mono text-[11px] uppercase tracking-wider text-emerald-600">{label}</p>
            <p className="mt-2 text-sm text-ink">Jordan Ellis</p>
            <p className="text-sm text-ink/60">123 Market Street, Portland, OR 97201</p>
            <div className="mt-4 flex gap-3 font-mono text-[11px] uppercase tracking-wider">
              <button className="text-ink/60 underline">Edit</button>
              <button className="text-red-600 underline">Remove</button>
            </div>
          </div>
        ))}
      </div>
      <Button variant="ghost" className="mt-6">+ Add new address</Button>
    </Card>
  );
}

function Notifications() {
  const items = [
    { label: "Order updates", desc: "Shipping and delivery status" },
    { label: "New arrivals", desc: "Weekly picks from new drops" },
    { label: "Price drops", desc: "Alerts on your wishlist items" },
  ];
  return (
    <Card title="Notifications">
      <div className="space-y-5">
        {items.map((it) => (
          <div key={it.label} className="flex items-center justify-between">
            <div>
              <p className="text-sm text-ink">{it.label}</p>
              <p className="text-xs text-ink/45">{it.desc}</p>
            </div>
            <label className="relative inline-flex h-6 w-11 cursor-pointer items-center">
              <input type="checkbox" defaultChecked className="peer sr-only" />
              <span className="h-6 w-11 rounded-full bg-ink/15 transition-colors peer-checked:bg-emerald-600" />
              <span className="absolute left-1 h-4 w-4 rounded-full bg-white transition-transform peer-checked:translate-x-5" />
            </label>
          </div>
        ))}
      </div>
    </Card>
  );
}

function Security() {
  return (
    <Card title="Password & security">
      <div className="grid gap-5 sm:grid-cols-2">
        <Input label="Current password" type="password" />
        <div />
        <Input label="New password" type="password" />
        <Input label="Confirm new password" type="password" />
      </div>
      <Button className="mt-7">Update password</Button>
    </Card>
  );
}
