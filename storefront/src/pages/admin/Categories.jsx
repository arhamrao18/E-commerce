import { useState } from "react";
import { GripVertical, Plus, Pencil, Trash2, Star } from "lucide-react";
import { categories as seedCategories } from "../../data/categories";
import { Eyebrow, Button } from "../../components/ui/UI";

export default function Categories() {
  const [list, setList] = useState(seedCategories.map((c) => ({ ...c, featured: c.id === "audio" || c.id === "apparel" })));
  const [dragId, setDragId] = useState(null);

  const onDrop = (targetId) => {
    if (!dragId || dragId === targetId) return;
    setList((prev) => {
      const items = [...prev];
      const from = items.findIndex((c) => c.id === dragId);
      const to = items.findIndex((c) => c.id === targetId);
      const [moved] = items.splice(from, 1);
      items.splice(to, 0, moved);
      return items;
    });
    setDragId(null);
  };

  const toggleFeatured = (id) =>
    setList((prev) => prev.map((c) => (c.id === id ? { ...c, featured: !c.featured } : c)));

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <Eyebrow>Catalog</Eyebrow>
          <h1 className="mt-2 font-display text-4xl text-ink">Categories</h1>
          <p className="mt-1 text-sm text-ink/50">Drag to reorder how categories appear on the storefront.</p>
        </div>
        <Button><Plus size={16} /> Add category</Button>
      </div>

      <div className="mt-8 space-y-3">
        {list.map((c) => (
          <div
            key={c.id}
            draggable
            onDragStart={() => setDragId(c.id)}
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => onDrop(c.id)}
            className="flex items-center gap-4 rounded-3xl glass p-4 shadow-glass"
          >
            <span className="cursor-grab text-ink/30"><GripVertical size={18} /></span>
            <img src={c.image} alt="" className="h-14 w-14 rounded-2xl object-cover" />
            <div className="flex-1">
              <p className="font-display text-lg text-ink">{c.name}</p>
              <p className="font-mono text-[11px] text-ink/40">{c.tagline} · {c.count} products</p>
            </div>
            <button
              onClick={() => toggleFeatured(c.id)}
              className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 font-mono text-[11px] ${
                c.featured ? "bg-brass-100 text-brass-600" : "bg-ink/6 text-ink/40"
              }`}
            >
              <Star size={12} className={c.featured ? "fill-brass-500" : ""} /> Featured
            </button>
            <button className="rounded-lg p-2 text-ink/50 hover:bg-ink/5 hover:text-ink"><Pencil size={15} /></button>
            <button className="rounded-lg p-2 text-ink/50 hover:bg-red-50 hover:text-red-600"><Trash2 size={15} /></button>
          </div>
        ))}
      </div>
    </div>
  );
}
