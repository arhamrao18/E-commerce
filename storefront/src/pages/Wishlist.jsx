import { Link } from "react-router-dom";
import { useStore } from "../context/StoreContext";
import { products } from "../data/products";
import ProductCard from "../components/product/ProductCard";
import { Button, Eyebrow } from "../components/ui/UI";

export default function Wishlist() {
  const { wishlist } = useStore();
  const items = products.filter((p) => wishlist.includes(p.id));

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-xl px-6 py-32 text-center">
        <h1 className="font-display text-3xl text-ink">Your wishlist is empty</h1>
        <p className="mt-2 text-sm text-ink/50">Tap the heart on anything you want to save for later.</p>
        <Link to="/shop">
          <Button className="mt-8">Browse products</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-14 lg:px-10">
      <Eyebrow>Saved</Eyebrow>
      <h1 className="mt-2 font-display text-4xl text-ink">Wishlist ({items.length})</h1>
      <div className="mt-10 grid grid-cols-2 gap-x-5 gap-y-12 sm:grid-cols-3 lg:grid-cols-4">
        {items.map((p, i) => (
          <ProductCard key={p.id} product={p} index={i} />
        ))}
      </div>
    </div>
  );
}
