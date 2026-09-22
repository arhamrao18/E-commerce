import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { adminCustomers } from "../../data/admin";
import { Eyebrow } from "../../components/ui/UI";

export default function Customers() {
  const [query, setQuery] = useState("");

  const filtered = useMemo(
    () =>
      adminCustomers.filter(
        (c) => c.name.toLowerCase().includes(query.toLowerCase()) || c.email.toLowerCase().includes(query.toLowerCase())
      ),
    [query]
  );

  return (
    <div>
      <Eyebrow>People</Eyebrow>
      <h1 className="mt-2 font-display text-4xl text-ink">Customers ({adminCustomers.length})</h1>

      <div className="mt-6 flex items-center gap-3 rounded-full border border-ink/15 bg-white/50 px-4 py-2.5 lg:max-w-sm">
        <Search size={16} className="text-ink/40" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search name or email…"
          className="w-full bg-transparent text-sm focus:outline-none"
        />
      </div>

      <div className="mt-6 overflow-x-auto rounded-3xl glass shadow-glass">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead>
            <tr className="border-b border-ink/8 font-mono text-[11px] uppercase tracking-wider text-ink/40">
              <th className="px-5 py-3.5">Customer</th>
              <th className="px-5 py-3.5">Email</th>
              <th className="px-5 py-3.5">Orders</th>
              <th className="px-5 py-3.5">Lifetime spend</th>
              <th className="px-5 py-3.5">Joined</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink/6">
            {filtered.map((c) => (
              <tr key={c.id} className="hover:bg-white/40">
                <td className="px-5 py-3 text-ink">{c.name}</td>
                <td className="px-5 py-3 font-mono text-xs text-ink/55">{c.email}</td>
                <td className="px-5 py-3 text-ink/70">{c.orders}</td>
                <td className="px-5 py-3 font-mono text-ink">${c.spent}</td>
                <td className="px-5 py-3 font-mono text-xs text-ink/50">{c.joined}</td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={5} className="px-5 py-10 text-center text-ink/40">No customers match "{query}"</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
