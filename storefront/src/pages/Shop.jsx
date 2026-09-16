import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { SlidersHorizontal, X } from "lucide-react";
import ProductCard from "../components/product/ProductCard";
import { Eyebrow } from "../components/ui/UI";
import { products } from "../data/products";
import { categories, brands } from "../data/categories";

const SORTS = [
  { id: "featured", label: "Featured" },
  { id: "price-asc", label: "Price: Low to High" },
  { id: "price-desc", label: "Price: High to Low" },
  { id: "rating", label: "Top Rated" },
];

export default function Shop() {
  const [params, setParams] = useSearchParams();
  const [filtersOpen, setFiltersOpen] = useState(false);

  const activeCategory = params.get("category") || "";
  const activeTag = params.get("tag") || "";
  const query = params.get("q") || "";
  const sort = params.get("sort") || "featured";
  const [maxPrice, setMaxPrice] = useState(350);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [minRating, setMinRating] = useState(0);

  const setParam = (key, value) => {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value);
    else next.delete(key);
    setParams(next);
  };

  const toggleBrand = (name) => {
    setSelectedBrands((prev) => (prev.includes(name) ? prev.filter((b) => b !== name) : [...prev, name]));
  };

  const filtered = useMemo(() => {
    let list = [...products];
    if (activeCategory) list = list.filter((p) => p.category === activeCategory);
    if (activeTag) list = list.filter((p) => p.tags.includes(activeTag));
    if (query) {
      const q = query.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      );
    }
    list = list.filter((p) => (p.discountPrice || p.price) <= maxPrice);
    if (selectedBrands.length) list = list.filter((p) => selectedBrands.includes(p.brand));
    if (minRating) list = list.filter((p) => p.rating >= minRating);

    if (sort === "price-asc") list.sort((a, b) => (a.discountPrice || a.price) - (b.discountPrice || b.price));
    if (sort === "price-desc") list.sort((a, b) => (b.discountPrice || b.price) - (a.discountPrice || a.price));
    if (sort === "rating") list.sort((a, b) => b.rating - a.rating);

    return list;
  }, [activeCategory, activeTag, query, maxPrice, selectedBrands, minRating, sort]);

  const clearAll = () => {
    setParams({});
    setMaxPrice(350);
    setSelectedBrands([]);
    setMinRating(0);
  };

  return (
    <div className="mx-auto max-w-7xl px-6 py-14 lg:px-10">
      <Eyebrow>{query ? `Results for "${query}"` : "Shop"}</Eyebrow>
      <div className="mt-2 flex flex-wrap items-end justify-between gap-4">
        <h1 className="font-display text-4xl text-ink capitalize">
          {activeCategory || activeTag?.replace("-", " ") || "All products"}
        </h1>
        <button
          onClick={() => setFiltersOpen(true)}
          className="flex items-center gap-2 rounded-full border border-ink/15 px-4 py-2 text-xs font-semibold uppercase tracking-wider lg:hidden"
        >
          <SlidersHorizontal size={14} /> Filters
        </button>
      </div>

      <div className="mt-10 grid gap-10 lg:grid-cols-[240px_1fr]">
        {/* Sidebar */}
        <aside className={`${filtersOpen ? "fixed inset-0 z-50 overflow-y-auto bg-porcelain p-6" : "hidden"} lg:static lg:block lg:bg-transparent lg:p-0`}>
          <div className="flex items-center justify-between lg:hidden">
            <p className="font-display text-xl">Filters</p>
            <button onClick={() => setFiltersOpen(false)} aria-label="Close filters">
              <X size={20} />
            </button>
          </div>

          <FilterBlock title="Category">
            <div className="space-y-2">
              {categories.map((c) => (
                <label key={c.id} className="flex cursor-pointer items-center gap-2.5 text-sm text-ink/70">
                  <input
                    type="radio"
                    name="category"
                    checked={activeCategory === c.id}
                    onChange={() => setParam("category", c.id)}
                    className="h-3.5 w-3.5 accent-emerald-600"
                  />
                  {c.name}
                </label>
              ))}
              {activeCategory && (
                <button onClick={() => setParam("category", "")} className="font-mono text-[11px] text-emerald-600 underline">
                  Clear category
                </button>
              )}
            </div>
          </FilterBlock>

          <FilterBlock title="Brand">
            <div className="space-y-2">
              {brands.map((b) => (
                <label key={b.id} className="flex cursor-pointer items-center gap-2.5 text-sm text-ink/70">
                  <input
                    type="checkbox"
                    checked={selectedBrands.includes(b.name)}
                    onChange={() => toggleBrand(b.name)}
                    className="h-3.5 w-3.5 accent-emerald-600"
                  />
                  {b.name}
                </label>
              ))}
            </div>
          </FilterBlock>

          <FilterBlock title="Max price">
            <input
              type="range"
              min={30}
              max={350}
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-emerald-600"
            />
            <p className="mt-1 font-mono text-xs text-ink/60">Up to ${maxPrice}</p>
          </FilterBlock>

          <FilterBlock title="Rating">
            <div className="flex gap-2">
              {[4, 4.5, 0].map((r) => (
                <button
                  key={r}
                  onClick={() => setMinRating(r)}
                  className={`rounded-full border px-3 py-1.5 font-mono text-xs ${
                    minRating === r ? "border-emerald-600 bg-emerald-50 text-emerald-700" : "border-ink/15 text-ink/60"
                  }`}
                >
                  {r === 0 ? "Any" : `${r}+`}
                </button>
              ))}
            </div>
          </FilterBlock>

          <button onClick={clearAll} className="mt-4 font-mono text-xs uppercase tracking-wider text-ink/50 underline">
            Clear all filters
          </button>

          <button
            onClick={() => setFiltersOpen(false)}
            className="mt-8 w-full rounded-full bg-ink py-3 text-sm font-semibold text-porcelain lg:hidden"
          >
            Show {filtered.length} results
          </button>
        </aside>

        {/* Grid */}
        <div>
          <div className="flex items-center justify-between border-b border-ink/8 pb-4">
            <p className="font-mono text-xs text-ink/50">{filtered.length} products</p>
            <select
              value={sort}
              onChange={(e) => setParam("sort", e.target.value)}
              className="rounded-full border border-ink/15 bg-transparent px-4 py-2 font-mono text-xs uppercase tracking-wider text-ink/70 focus:outline-none"
            >
              {SORTS.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>

          {filtered.length === 0 ? (
            <div className="py-24 text-center">
              <p className="font-display text-2xl text-ink">No products match those filters</p>
              <p className="mt-2 text-sm text-ink/50">Try widening your price range or clearing a filter.</p>
              <button onClick={clearAll} className="mt-6 rounded-full bg-ink px-6 py-3 text-sm font-semibold text-porcelain">
                Clear filters
              </button>
            </div>
          ) : (
            <div className="mt-8 grid grid-cols-2 gap-x-5 gap-y-12 sm:grid-cols-3">
              {filtered.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function FilterBlock({ title, children }) {
  return (
    <div className="border-b border-ink/8 py-5 first:pt-0">
      <p className="font-mono text-[11px] uppercase tracking-wider text-ink/45">{title}</p>
      <div className="mt-3">{children}</div>
    </div>
  );
}
