import Hero from "../components/home/Hero";
import CategoryGrid from "../components/home/CategoryGrid";
import ProductRail from "../components/home/ProductRail";
import FlashDeals from "../components/home/FlashDeals";
import { Testimonials, BrandStrip } from "../components/home/Testimonials";
import { products, bestSellers, trending, flashDeals } from "../data/products";

export default function Home() {
  return (
    <>
      <Hero />
      <CategoryGrid />
      <ProductRail eyebrow="Featured" title="Featured products" products={products} />
      <FlashDeals products={flashDeals} />
      <ProductRail
        eyebrow="Right now"
        title="Trending this week"
        products={trending}
        viewAllHref="/shop?tag=trending"
      />
      <ProductRail
        eyebrow="Fan favorites"
        title="Best sellers"
        products={bestSellers}
        viewAllHref="/shop?tag=bestseller"
      />
      <BrandStrip />
      <Testimonials />
    </>
  );
}
