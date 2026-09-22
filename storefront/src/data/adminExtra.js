import { products } from "./products";
import { adminCustomers } from "./admin";

export const coupons = [
  { id: "CP-01", code: "LUMEN10", type: "Percentage", value: 10, scope: "All orders", uses: 342, limit: 1000, status: "Active", expires: "2026-08-31" },
  { id: "CP-02", code: "WELCOME15", type: "Percentage", value: 15, scope: "First order", uses: 891, limit: null, status: "Active", expires: "2026-12-31" },
  { id: "CP-03", code: "FREESHIP", type: "Free shipping", value: 0, scope: "Orders over $50", uses: 210, limit: 500, status: "Active", expires: "2026-09-15" },
  { id: "CP-04", code: "SUMMER25", type: "Fixed", value: 25, scope: "Apparel category", uses: 88, limit: 300, status: "Scheduled", expires: "2026-08-01" },
  { id: "CP-05", code: "VIP20", type: "Percentage", value: 20, scope: "Customer group: VIP", uses: 47, limit: 100, status: "Active", expires: "2026-10-01" },
  { id: "CP-06", code: "FLASH50", type: "Percentage", value: 50, scope: "Flash deal items", uses: 500, limit: 500, status: "Expired", expires: "2026-06-30" },
];

export const reviewQueue = [
  { id: "RV-101", product: products[0].name, customer: "Dana K.", rating: 5, body: "Genuinely changed how I take calls, never going back.", status: "Approved", date: "2026-07-18", flagged: false },
  { id: "RV-102", product: products[2].name, customer: "Priya S.", rating: 5, body: "Fits exactly like the size guide says.", status: "Approved", date: "2026-07-17", flagged: false },
  { id: "RV-103", product: products[6].name, customer: "anon_user82", rating: 1, body: "Terrible product, contains offensive spam link http://scam.example", status: "Pending", date: "2026-07-20", flagged: true },
  { id: "RV-104", product: products[5].name, customer: "Owen R.", rating: 5, body: "Swapped switches in ten minutes, feels premium.", status: "Pending", date: "2026-07-19", flagged: false },
  { id: "RV-105", product: products[9].name, customer: "Marcus T.", rating: 2, body: "Charging is slower than advertised on my phone.", status: "Pending", date: "2026-07-21", flagged: false },
  { id: "RV-106", product: products[3].name, customer: "Sasha I.", rating: 5, body: "Best pour-over I've owned, the double wall really works.", status: "Featured", date: "2026-07-10", flagged: false },
];

export const notifications = [
  { id: "N-1", type: "order", title: "New order LM-482913", body: "Jordan Ellis placed an order for $199.", time: "8m ago", read: false },
  { id: "N-2", type: "inventory", title: "Low stock: Aria Open-Ear Headphones", body: "Only 4 units left in Graphite.", time: "42m ago", read: false },
  { id: "N-3", type: "review", title: "Review flagged for moderation", body: "RV-103 was flagged by the spam filter.", time: "1h ago", read: false },
  { id: "N-4", type: "payment", title: "Refund processed", body: "$68.00 refunded for order LM-479881.", time: "3h ago", read: true },
  { id: "N-5", type: "ai", title: "AI insight ready", body: "Restock recommendation generated for 5 products.", time: "5h ago", read: true },
  { id: "N-6", type: "customer", title: "New customer signup", body: "Alina Novak created an account.", time: "1d ago", read: true },
];

export const activityLog = [
  { id: "AC-1", actor: "admin@lumen.co", action: "Updated order LM-482913 status to Shipped", time: "2026-07-22 09:14", type: "order" },
  { id: "AC-2", actor: "sales@lumen.co", action: "Created coupon SUMMER25", time: "2026-07-21 16:02", type: "coupon" },
  { id: "AC-3", actor: "admin@lumen.co", action: "Edited product Keystone Mechanical Keyboard", time: "2026-07-21 11:47", type: "product" },
  { id: "AC-4", actor: "support@lumen.co", action: "Approved review RV-102", time: "2026-07-20 14:23", type: "review" },
  { id: "AC-5", actor: "admin@lumen.co", action: "Logged in from new device (Chrome, Portland OR)", time: "2026-07-20 08:01", type: "security" },
  { id: "AC-6", actor: "inventory@lumen.co", action: "Adjusted stock for Orbit Wireless Charger (+40 units)", time: "2026-07-19 17:30", type: "inventory" },
];

export const roles = [
  { id: "R-1", name: "Super Admin", users: 1, permissions: "Full access to all modules" },
  { id: "R-2", name: "Admin", users: 2, permissions: "All modules except billing & roles" },
  { id: "R-3", name: "Manager", users: 3, permissions: "Orders, products, customers, reports" },
  { id: "R-4", name: "Inventory Manager", users: 2, permissions: "Products, stock, suppliers" },
  { id: "R-5", name: "Customer Support", users: 4, permissions: "Orders, customers, reviews" },
  { id: "R-6", name: "Sales Manager", users: 2, permissions: "Orders, coupons, analytics" },
  { id: "R-7", name: "Marketing Manager", users: 1, permissions: "Content, coupons, newsletter" },
];

const trendSeed = (i) => 40 + Math.round(30 * Math.sin(i / 2) + (i % 5) * 6);

export const inventoryPredictions = products.map((p, i) => ({
  ...p,
  healthScore: 55 + ((i * 13) % 40),
  velocity: ["Fast moving", "Steady", "Slow moving", "Dead stock"][i % 4],
  daysToStockOut: 6 + ((i * 7) % 40),
  recommendedRestock: 20 + ((i * 11) % 60),
  demandTrend: Array.from({ length: 8 }, (_, j) => ({ week: `W${j + 1}`, demand: trendSeed(i + j) })),
}));

export const fraudOrders = [
  { id: "LM-483211", customer: "unknown_buyer19", riskScore: 92, reasons: ["Billing/shipping address mismatch", "3 failed payment attempts", "New account, high-value order"], amount: 640, date: "2026-07-21", status: "Manual review" },
  { id: "LM-483180", customer: "Marcus Tran", riskScore: 34, reasons: ["New device"], amount: 89, date: "2026-07-21", status: "Cleared" },
  { id: "LM-483102", customer: "guest_4471", riskScore: 78, reasons: ["VPN/proxy IP detected", "Multiple cards tried"], amount: 320, date: "2026-07-20", status: "Manual review" },
  { id: "LM-482990", customer: "Elena Cruz", riskScore: 12, reasons: [], amount: 145, date: "2026-07-20", status: "Cleared" },
  { id: "LM-482874", customer: "guest_2209", riskScore: 65, reasons: ["Express shipping to freight forwarder", "Order value 4x account average"], amount: 890, date: "2026-07-19", status: "Manual review" },
];

export const aiSuggestedPrompts = [
  "Summarize this week's revenue vs. last week",
  "Which products are at risk of stocking out this month?",
  "Draft a product description for the Ridge Wool Blanket",
  "Which customers haven't ordered in 90+ days?",
  "Suggest a discount to clear slow-moving inventory",
];
