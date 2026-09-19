import { products } from "./products";

const statuses = ["Pending", "Paid", "Processing", "Shipped", "Delivered", "Cancelled", "Refunded"];

const customerNames = [
  "Jordan Ellis", "Sasha Ito", "Miguel Santos", "Priya Sharma", "Owen Reyes",
  "Dana Kim", "Marcus Tran", "Elena Cruz", "Theo Bennett", "Alina Novak",
  "Farid Rahman", "Lucia Moreno",
];

function seedRandom(seed) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}
const rand = seedRandom(42);

export const adminOrders = Array.from({ length: 28 }, (_, i) => {
  const p = products[Math.floor(rand() * products.length)];
  const qty = 1 + Math.floor(rand() * 3);
  const total = (p.discountPrice || p.price) * qty;
  const daysAgo = Math.floor(rand() * 45);
  const date = new Date(Date.now() - daysAgo * 86400000);
  return {
    id: `LM-${480000 + i}`,
    customer: customerNames[Math.floor(rand() * customerNames.length)],
    date: date.toISOString().slice(0, 10),
    status: statuses[Math.floor(rand() * (i < 3 ? 3 : statuses.length))],
    items: [{ product: p, qty }],
    total,
  };
}).sort((a, b) => new Date(b.date) - new Date(a.date));

export const adminCustomers = customerNames.map((name, i) => {
  const orders = adminOrders.filter((o) => o.customer === name);
  return {
    id: `CU-${1000 + i}`,
    name,
    email: `${name.toLowerCase().replace(/\s+/g, ".")}@email.com`,
    orders: orders.length,
    spent: orders.reduce((s, o) => s + o.total, 0),
    joined: `2025-${String(1 + (i % 12)).padStart(2, "0")}-14`,
  };
});

export const revenueByMonth = [
  { month: "Feb", revenue: 18400, orders: 142 },
  { month: "Mar", revenue: 21200, orders: 168 },
  { month: "Apr", revenue: 19800, orders: 151 },
  { month: "May", revenue: 24600, orders: 189 },
  { month: "Jun", revenue: 27950, orders: 214 },
  { month: "Jul", revenue: 25100, orders: 198 },
];

export const orderStatusBreakdown = statuses.map((s) => ({
  status: s,
  count: adminOrders.filter((o) => o.status === s).length,
}));

export const topProducts = [...products]
  .sort((a, b) => b.reviewCount - a.reviewCount)
  .slice(0, 5)
  .map((p) => ({ ...p, unitsSold: 40 + Math.floor(rand() * 200) }));
