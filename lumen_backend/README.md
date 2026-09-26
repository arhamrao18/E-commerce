# Lumen Backend — Django REST Framework + PostgreSQL

This is the API that will replace every mock data file in the React frontend
(`src/data/*.js`). It's been built and tested end-to-end against a real
PostgreSQL database — migrations run clean, and register → login → browse
products → add to cart → checkout → leave a review all work.

## 1. Setup

```bash
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt

cp .env.example .env            # then edit DB credentials if needed
```

Create the database (PostgreSQL must be running):

```sql
CREATE USER lumen_user WITH PASSWORD 'lumen_password' CREATEDB;
CREATE DATABASE lumen_db OWNER lumen_user;
```

Then:

```bash
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

API is now at `http://127.0.0.1:8000/api/`, Django admin at `/admin/`,
interactive API docs (Swagger) at `/api/docs/`.

## 2. Project structure

```
config/         # settings, root urls
accounts/       # custom User (email login + RBAC role), Address, JWT auth
catalog/        # Category, Brand, Product, ProductImage, ProductVariant
orders/         # Cart, CartItem, Coupon, Order, OrderItem, checkout logic
reviews/        # Review, ReviewImage, moderation
engagement/     # Wishlist, Notification, ActivityLog, AI-ready endpoints
```

Each app follows the same pattern: `models.py` → `serializers.py` →
`views.py` (ViewSets where the frontend needs full CRUD, APIView where it
needs a custom action like checkout) → `urls.py` registered in
`config/urls.py`.

## 3. Authentication

JWT via `djangorestframework-simplejwt`. Access tokens last 30 minutes,
refresh tokens 7 days and rotate/blacklist on use.

| Endpoint | Method | Purpose |
|---|---|---|
| `/api/auth/register/` | POST | create a customer account |
| `/api/auth/login/` | POST | returns `access`, `refresh`, and the user profile |
| `/api/auth/refresh/` | POST | exchange a refresh token for a new access token |
| `/api/auth/logout/` | POST | blacklists the refresh token |
| `/api/auth/me/` | GET/PATCH | current user's profile |
| `/api/auth/change-password/` | POST | |
| `/api/addresses/` | GET/POST/PATCH/DELETE | saved shipping/billing addresses |

Send `Authorization: Bearer <access_token>` on every authenticated request.

**Roles** live on `User.role` (`customer`, `super_admin`, `admin`, `manager`,
`inventory_manager`, `customer_support`, `sales_manager`, `marketing_manager`).
`accounts/permissions.py` has `IsStaffRole` (any non-customer role) and
`ReadOnlyOrStaff` (public read, staff write) — used across catalog/orders/
reviews so the admin panel and storefront share the same endpoints safely.

## 4. Catalog

| Endpoint | Notes |
|---|---|
| `GET /api/categories/` | top-level only; each has a nested `children` array |
| `GET /api/brands/` | |
| `GET /api/products/` | `?search=`, `?category=<slug>`, `?brand=<slug>`, `?min_price=`, `?max_price=`, `?tag=`, `?ordering=price,-price,-created_at,avg_rating`, paginated |
| `GET /api/products/{slug}/` | full detail — images, variants, description |
| `POST/PATCH/DELETE /api/products/` | staff only |

Draft/archived products are hidden from public list requests automatically
(filtered in `ProductViewSet.get_queryset`), but visible to staff.

## 5. Cart & checkout

Cart works for both guests (Django session key) and logged-in users
(`Cart.user`), so the frontend doesn't need to branch on auth state.

| Endpoint | Method | Notes |
|---|---|---|
| `/api/cart/` | GET | current cart |
| `/api/cart/items/` | POST | `{product_id, variant_id?, quantity}` |
| `/api/cart/items/{id}/` | PATCH/DELETE | update quantity / remove |
| `/api/cart/apply-coupon/` | POST | `{code}` |
| `/api/orders/checkout/` | POST | shipping fields + `payment_method_id` → creates the `Order`, decrements stock, clears the cart |
| `/api/orders/` | GET | staff see all, customers see their own |
| `/api/orders/{id}/status/` | PATCH | staff only — updates status and writes an `OrderStatusEvent` (the timeline shown in the admin order detail view) |
| `/api/coupons/` | staff CRUD | powers the admin Coupons page |

**Payments**: `orders/services.py` has a `charge_payment()` function that's
Stripe-ready — with no `STRIPE_SECRET_KEY` set it returns a stub payment id
so checkout works end-to-end in dev/demo. Add your key and uncomment the
real `stripe.PaymentIntent` call (shown in the docstring) to go live. Swapping
in PayPal or Razorpay later means adding a sibling function here, not
touching the checkout view.

Tax (8%) and shipping ($8 flat, free over $75) are calculated server-side in
the checkout view — matching the numbers the frontend cart page previews.

## 6. Reviews

`GET /api/reviews/?product=<slug>` — public users only see `approved`/
`featured` reviews; staff (via the admin Reviews page) see everything.
`PATCH /api/reviews/{id}/moderate/` (staff only) sets status to approved/
featured/rejected — this is what the admin Reviews page's Approve/Feature/
Reject buttons call.

## 7. Wishlist, notifications, activity log

- `/api/wishlist/` — CRUD, scoped to the logged-in user
- `/api/notifications/` — staff notification center; `POST .../read/` and
  `.../mark-all-read/`
- `/api/activity-log/` — read-only audit trail, filterable by `?category=`

## 8. AI-ready endpoints (Intelligence section)

These power the admin AI Assistant / Sales Intelligence / Inventory
Prediction / Fraud Detection pages. Per the spec, they return realistic
**placeholder data today** and are structured so only the function body
changes when real AI/ML logic (or an n8n workflow) is plugged in:

| Endpoint | Powers |
|---|---|
| `GET /api/analytics/dashboard/` | admin Dashboard cards + charts (this one is already real — it aggregates actual `Order`/`Product` data, not placeholder) |
| `GET /api/intelligence/sales/` | Sales Intelligence page |
| `GET /api/intelligence/inventory-prediction/` | Inventory Prediction page |
| `GET /api/intelligence/fraud-detection/` | Fraud Detection page |
| `POST /api/intelligence/ai-assistant/chat/` | AI Assistant chat — set `AI_ASSISTANT_WEBHOOK_URL` in `.env` to forward messages to a real n8n workflow; without it, returns a clearly-labeled placeholder reply |

## 9. Connecting the React frontend

Right now the frontend imports fake arrays from `src/data/*.js`. To wire it
up for real:

1. Add `axios` and `@tanstack/react-query` (both already listed as
   available libraries).
2. Create an `src/api/client.js` with an Axios instance pointed at
   `http://localhost:8000/api`, and an interceptor that attaches the JWT
   access token and refreshes it on 401.
3. Replace each `import { products } from "../data/products"` with a
   `useQuery(["products", filters], () => api.get("/products/", {params}))`
   call, matching the query params documented above.
4. `StoreContext.jsx`'s `addToCart`/`toggleWishlist`/etc. get an API call
   added alongside (or instead of) the local state update.
5. The admin pages' `useState(seedData)` calls become `useQuery`/
   `useMutation` pairs against the staff-only endpoints (all already
   permission-gated with `IsStaffRole`, so no frontend auth logic changes
   are needed beyond sending the token).

## 10. What's deliberately not built yet

- Email sending (verification, password reset) — hooks exist (`email_verified`
  field, `ChangePasswordView`) but no email backend is configured
  - add `django.core.mail` + an SMTP/SES backend when ready
- Real Stripe charge (stubbed, see §5)
- Real AI/ML logic behind the Intelligence endpoints (intentionally
  placeholder, per the spec)
- Rate limiting is configured (`DEFAULT_THROTTLE_RATES`) but not tuned for
  production traffic
- Production deployment config (gunicorn/uwsgi, static file serving via
  whitenoise or S3, HTTPS) — this is dev-server only right now
