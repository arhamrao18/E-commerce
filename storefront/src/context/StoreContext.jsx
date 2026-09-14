import { createContext, useContext, useMemo, useState, useEffect } from "react";

const StoreContext = createContext(null);

export function StoreProvider({ children }) {
  const [cart, setCart] = useState([]); // { productId, qty, color, size }
  const [wishlist, setWishlist] = useState([]); // productId[]
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2600);
    return () => clearTimeout(t);
  }, [toast]);

  const notify = (message) => setToast({ id: Date.now(), message });

  const addToCart = (product, { qty = 1, color, size } = {}) => {
    setCart((prev) => {
      const key = (i) => i.productId === product.id && i.color === color && i.size === size;
      const existing = prev.find(key);
      if (existing) {
        return prev.map((i) => (key(i) ? { ...i, qty: i.qty + qty } : i));
      }
      return [...prev, { productId: product.id, qty, color, size }];
    });
    notify(`Added ${product.name} to cart`);
  };

  const removeFromCart = (productId, color, size) => {
    setCart((prev) => prev.filter((i) => !(i.productId === productId && i.color === color && i.size === size)));
  };

  const updateQty = (productId, color, size, qty) => {
    setCart((prev) =>
      prev
        .map((i) => (i.productId === productId && i.color === color && i.size === size ? { ...i, qty } : i))
        .filter((i) => i.qty > 0)
    );
  };

  const toggleWishlist = (product) => {
    setWishlist((prev) => {
      if (prev.includes(product.id)) {
        notify(`Removed ${product.name} from wishlist`);
        return prev.filter((id) => id !== product.id);
      }
      notify(`Saved ${product.name} to wishlist`);
      return [...prev, product.id];
    });
  };

  const cartCount = useMemo(() => cart.reduce((sum, i) => sum + i.qty, 0), [cart]);

  const value = {
    cart,
    wishlist,
    cartCount,
    addToCart,
    removeFromCart,
    updateQty,
    toggleWishlist,
    toast,
    notify,
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}
