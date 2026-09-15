import { motion } from "framer-motion";
import { Quote } from "lucide-react";
import { testimonials } from "../../data/products";
import { brands } from "../../data/categories";
import { Eyebrow } from "../ui/UI";

export function Testimonials() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-24 lg:px-10">
      <Eyebrow>What people say</Eyebrow>
      <h2 className="mt-2 font-display text-4xl text-ink">Trusted by careful buyers</h2>

      <div className="mt-10 grid gap-5 sm:grid-cols-3">
        {testimonials.map((t, i) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: i * 0.08 }}
            className="rounded-3xl glass p-7 shadow-glass"
          >
            <Quote size={20} className="text-brass-500" />
            <p className="mt-4 font-display text-lg leading-snug text-ink text-balance">"{t.quote}"</p>
            <p className="mt-5 font-mono text-[11px] uppercase tracking-wider text-ink/45">
              {t.name} · {t.role}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

export function BrandStrip() {
  return (
    <section className="border-y border-ink/8 bg-porcelain-100 py-12">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <p className="text-center font-mono text-[11px] uppercase tracking-wider text-ink/40">
          Carrying makers from
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-x-12 gap-y-4">
          {brands.map((b) => (
            <span key={b.id} className="font-display text-xl text-ink/35 transition-colors hover:text-ink/70">
              {b.name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
