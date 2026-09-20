import { useMemo, useState } from "react";
import { Search, Plus, Pencil, Trash2, X } from "lucide-react";
import { products as seedProducts } from "../../data/products";
import { Eyebrow, Button } from "../../components/ui/UI";

export default function Products() {
  const [products, setProducts] = useState(seedProducts);
  const [query, setQuery] = useState("");
  const [editing, setEditing] = useState(null); // product or "new"

  const filtered = useMemo(
    () =>
      products.filter(
        (p) =>
          p.name.toLowerCase().includes(query.toLowerCase()) ||
          p.brand.toLowerCase().includes(query.toLowerCase()) ||
          p.sku.toLowerCase().includes(query.toLowerCase())
      ),
    [products, query]
  );

  const remove = (id) => setProducts((prev) => prev.filter((p) => p.id !== id));

  const save = (form) => {
    if (form.id && products.some((p) => p.id === form.id)) {
      setProducts((prev) => prev.map((p) => (p.id === form.id ? { ...p, ...form } : p)));
    } else {
      setProducts((prev) => [{ ...form, id: `p${Date.now()}`, images: [form.image || "https://picsum.photos/seed/new/800/1000"] }, ...prev]);
    }
    setEditing(null);
  };

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <Eyebrow>Catalog</Eyebrow>
          <h1 className="mt-2 font-display text-4xl text-ink">Products ({products.length})</h1>
        </div>
        <Button onClick={() => setEditing("new")}>
          <Plus size={16} /> Add product
        </Button>
      </div>

      <div className="mt-6 flex items-center gap-3 rounded-full border border-ink/15 bg-white/50 px-4 py-2.5 lg:max-w-sm">
        <Search size={16} className="text-ink/40" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search name, brand, SKU…"
          className="w-full bg-transparent text-sm focus:outline-none"
        />
      </div>

      <div className="mt-6 overflow-x-auto rounded-3xl glass shadow-glass">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead>
            <tr className="border-b border-ink/8 font-mono text-[11px] uppercase tracking-wider text-ink/40">
              <th className="px-5 py-3.5">Product</th>
              <th className="px-5 py-3.5">SKU</th>
              <th className="px-5 py-3.5">Category</th>
              <th className="px-5 py-3.5">Price</th>
              <th className="px-5 py-3.5">Stock</th>
              <th className="px-5 py-3.5"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink/6">
            {filtered.map((p) => (
              <tr key={p.id} className="hover:bg-white/40">
                <td className="flex items-center gap-3 px-5 py-3">
                  <img src={p.images[0]} alt="" className="h-11 w-10 rounded-lg object-cover" />
                  <div>
                    <p className="text-ink">{p.name}</p>
                    <p className="font-mono text-[11px] text-ink/40">{p.brand}</p>
                  </div>
                </td>
                <td className="px-5 py-3 font-mono text-xs text-ink/60">{p.sku}</td>
                <td className="px-5 py-3 capitalize text-ink/70">{p.category}</td>
                <td className="px-5 py-3 font-mono text-ink">${p.discountPrice || p.price}</td>
                <td className="px-5 py-3">
                  <span
                    className={`rounded-full px-2.5 py-1 font-mono text-[11px] ${
                      p.stock > 15 ? "bg-emerald-50 text-emerald-700" : p.stock > 0 ? "bg-brass-100 text-brass-600" : "bg-red-50 text-red-600"
                    }`}
                  >
                    {p.stock} in stock
                  </span>
                </td>
                <td className="px-5 py-3">
                  <div className="flex justify-end gap-2">
                    <button onClick={() => setEditing(p)} aria-label="Edit product" className="rounded-lg p-1.5 text-ink/50 hover:bg-ink/5 hover:text-ink">
                      <Pencil size={15} />
                    </button>
                    <button onClick={() => remove(p.id)} aria-label="Delete product" className="rounded-lg p-1.5 text-ink/50 hover:bg-red-50 hover:text-red-600">
                      <Trash2 size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="px-5 py-10 text-center text-ink/40">No products match "{query}"</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {editing && <ProductModal product={editing === "new" ? null : editing} onClose={() => setEditing(null)} onSave={save} />}
    </div>
  );
}

function ProductModal({ product, onClose, onSave }) {
  const [form, setForm] = useState(
    product || { name: "", brand: "", category: "audio", price: "", stock: "", sku: "" }
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/50 p-6" onClick={onClose}>
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg rounded-4xl bg-porcelain-50 p-8 shadow-glass-lg"
      >
        <div className="flex items-center justify-between">
          <h2 className="font-display text-2xl text-ink">{product ? "Edit product" : "Add product"}</h2>
          <button onClick={onClose} aria-label="Close"><X size={20} /></button>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSave({ ...form, price: Number(form.price), stock: Number(form.stock) });
          }}
          className="mt-6 space-y-4"
        >
          <TextField label="Product name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} />
          <div className="grid grid-cols-2 gap-4">
            <TextField label="Brand" value={form.brand} onChange={(v) => setForm({ ...form, brand: v })} />
            <TextField label="SKU" value={form.sku} onChange={(v) => setForm({ ...form, sku: v })} />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <TextField label="Price ($)" type="number" value={form.price} onChange={(v) => setForm({ ...form, price: v })} />
            <TextField label="Stock" type="number" value={form.stock} onChange={(v) => setForm({ ...form, stock: v })} />
            <label className="block">
              <span className="font-mono text-[11px] uppercase tracking-wider text-ink/45">Category</span>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="mt-1.5 w-full rounded-xl border border-ink/15 bg-white px-3 py-3 text-sm focus:border-emerald-600 focus:outline-none"
              >
                {["audio", "home", "apparel", "accessories", "tech", "outdoor"].map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </label>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
            <Button type="submit">Save product</Button>
          </div>
        </form>
      </div>
    </div>
  );
}

function TextField({ label, ...props }) {
  return (
    <label className="block">
      <span className="font-mono text-[11px] uppercase tracking-wider text-ink/45">{label}</span>
      <input
        required
        {...props}
        onChange={(e) => props.onChange(e.target.value)}
        className="mt-1.5 w-full rounded-xl border border-ink/15 bg-white px-3 py-3 text-sm focus:border-emerald-600 focus:outline-none"
      />
    </label>
  );
}
