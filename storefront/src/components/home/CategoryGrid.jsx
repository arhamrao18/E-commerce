import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { categories } from "../../data/categories";
import { Eyebrow } from "../ui/UI";

export default function CategoryGrid() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-24 lg:px-10">
      <div className="flex items-end justify-between">
        <div>
          <Eyebrow>Browse</Eyebrow>
          <h2 className="mt-2 font-display text-4xl text-ink">Shop by category</h2>
        </div>
      </div>

      <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {categories.map((c, i) => (
          <motion.div
            key={c.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: i * 0.05 }}
          >
            <Link to={`/shop?category=${c.id}`} className="group block">
              <div className="relative aspect-[3/4] overflow-hidden rounded-3xl bg-ink-700">
                <img
                  src={c.image}
                  alt={c.name}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/10 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-4">
                  <h3 className="font-display text-lg text-porcelain">{c.name}</h3>
                  <p className="font-mono text-[10px] uppercase tracking-wider text-porcelain/50">
                    {c.count} pieces
                  </p>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
