import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Eyebrow, Button } from "../ui/UI";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-ink">
      <div className="pointer-events-none absolute left-1/2 top-0 h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-emerald-500/25 blur-[140px]" />
      <div className="pointer-events-none absolute -right-32 top-40 h-72 w-72 rounded-full bg-brass-500/20 blur-[110px]" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-6 py-24 lg:grid-cols-2 lg:py-32 lg:px-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <Eyebrow className="text-emerald-400">Summer collection — 2026</Eyebrow>
          <h1 className="mt-5 font-display text-5xl leading-[1.05] text-porcelain text-balance sm:text-6xl lg:text-7xl">
            Objects built to <span className="italic text-emerald-400">outlast</span> the season.
          </h1>
          <p className="mt-6 max-w-md text-base text-porcelain/60">
            Considered goods across audio, home, and apparel — sourced from makers who still repair what they sell.
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-4">
            <Link to="/shop">
              <Button variant="brass">
                Shop the collection <ArrowRight size={15} />
              </Button>
            </Link>
            <Link to="/shop?tag=new">
              <Button variant="glass" className="text-porcelain glass-dark hover:bg-white/10">
                New arrivals
              </Button>
            </Link>
          </div>

          <div className="mt-14 flex items-center gap-8 border-t border-porcelain/10 pt-6">
            <div>
              <p className="font-display text-2xl text-porcelain">120+</p>
              <p className="font-mono text-[11px] uppercase tracking-wider text-porcelain/40">Makers</p>
            </div>
            <div>
              <p className="font-display text-2xl text-porcelain">4.8</p>
              <p className="font-mono text-[11px] uppercase tracking-wider text-porcelain/40">Avg. rating</p>
            </div>
            <div>
              <p className="font-display text-2xl text-porcelain">30-day</p>
              <p className="font-mono text-[11px] uppercase tracking-wider text-porcelain/40">Returns</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.15 }}
          className="relative"
        >
          <div className="relative mx-auto aspect-[4/5] max-w-md overflow-hidden rounded-4xl glass-dark p-3 shadow-glass-lg">
            <img
              src="https://picsum.photos/seed/lumen-hero/900/1150"
              alt="Featured product styled in a sunlit interior"
              className="h-full w-full rounded-[1.6rem] object-cover"
            />
          </div>
          <div className="absolute -bottom-8 -left-8 hidden w-52 rounded-3xl glass p-4 shadow-glass-lg sm:block">
            <p className="font-mono text-[10px] uppercase tracking-wider text-emerald-600">Now trending</p>
            <p className="mt-1 font-display text-lg text-ink">Aria Open-Ear Headphones</p>
            <p className="mt-1 font-mono text-sm text-ink/70">$199</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
