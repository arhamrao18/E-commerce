# Lumen — Premium Ecommerce Storefront (Frontend Prototype)

This is the **frontend design phase** of the Lumen storefront — a React + Vite + Tailwind
UI built on realistic mock data, so the visual language and every core shopping flow can be
reviewed before wiring it to a real Django REST API backend.

## Design direction

- **Palette**: porcelain (cool off-white) and ink (near-black) as base surfaces, deep
  emerald as the primary accent, and brass as a metallic highlight used sparingly for
  price tags, flash-deal badges, and CTA moments.
- **Type**: Fraunces (display serif) for headlines and product names, Manrope for UI/body
  text, IBM Plex Mono for prices, SKUs, labels, and eyebrows.
- **Signature element**: "glass aura" — frosted glass panels (backdrop-blur) floating over
  soft blurred color gradients, used in the nav, hero, product cards, and checkout summary.

## What's built

- Home (hero, category grid, featured/trending/best-seller rails, flash deals with live
  countdown, brand strip, testimonials, newsletter)
- Shop / listing page with category, brand, price, and rating filters + sorting + search
- Product detail (gallery, variants, quantity, tabs for description/specs/reviews, similar
  products)
- Cart (quantity controls, remove, coupon code — try `LUMEN10`, dynamic totals)
- Wishlist
- Checkout (3-step: shipping → payment → review, with order confirmation)
- Login / Register (glass panel, guest checkout option)
- Account dashboard (profile, orders, addresses, notifications, security tabs)

All data lives in `src/data/` (mock, in-memory) and cart/wishlist state lives in
`src/context/StoreContext.jsx`. There is no backend wired up yet — that's the next phase.

## Run it

```bash
npm install
npm run dev
```

## Next phase

Once you're happy with the design, the next step is the Django REST Framework backend
(real models, JWT auth, PostgreSQL) and wiring this frontend to it via Axios/React Query,
replacing everything in `src/data/` with live API calls.

## Admin dashboard (added)

`/admin` — a separate layout (no storefront nav/footer) with a grouped sidebar:

- **Store**: Dashboard (revenue/order charts via Recharts), Products (table + add/edit modal),
  Categories (drag-to-reorder), Orders (status updates, filters), Coupons, Reviews
  (approve/feature/reject queue), Customers
- **Intelligence** (AI-ready, placeholder data as specced): AI Assistant (ChatGPT-style
  glassmorphism chat with history sidebar, suggested prompts, typing indicator, canned
  markdown-flavored responses), Sales Intelligence (forecast, funnel, LTV), Inventory
  Prediction (health score, demand sparklines, stock-out countdown), Fraud Detection
  (risk scoring, signal breakdown, review modal)
- **System**: Notifications, Activity log (audit trail), Roles & permissions (RBAC UI),
  Settings

All admin data lives in `src/data/admin.js` and `src/data/adminExtra.js` — mock but
realistically shaped, so charts and tables aren't empty placeholders. None of this is
wired to a backend yet.
