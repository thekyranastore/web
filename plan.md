# plan.md — Kirana Build Plan

This is the phased execution plan. Work through phases in order; don't start a later phase's UI until the earlier phase's exit criteria are met. Schema for future phases (payments, delivery) is seeded early as placeholders per `AGENT.md`, but their UI/logic stays out of scope until Phase 5.

## Status

Phases 0–4 are code-complete (scaffold, auth, schema, onboarding, dashboard, storefront, settings). `npm run build`, `npm run lint`, and `tsc --noEmit` all pass. **Not yet verified against a live database or S3 bucket** — no Neon connection string or AWS credentials have been provided yet. Before treating any phase's exit criteria as met, provide `DATABASE_URL` and run `npm run db:push` then `npm run db:seed`, and provide AWS creds for image upload testing. Then walk through: signup → onboarding wizard → dashboard → add product → visit public storefront → checkout → verify order appears in dashboard.

## Phase 0 — Project Scaffold, Auth, DB Schema

**Deliverables**
- Next.js 15 app initialized (App Router, TypeScript, Tailwind, Shadcn CLI configured with `new-york` style per `design.md`)
- Neon Postgres project created; connection string in `.env` (never committed)
- Drizzle ORM configured (`db/index.ts`, `drizzle.config.ts`), `db/schema/` with initial tables: `users` (Better Auth managed), `merchants`, `shops`, `shop_categories` (seeded), `products`, `orders`, `order_items`, `payout_accounts` (placeholder), `delivery_configs` (placeholder)
- Better Auth wired: `lib/auth.ts` (server), `lib/auth-client.ts` (client), Drizzle adapter, email/password sign-up + login working end-to-end
- `middleware.ts` scaffolded (auth check only for now; onboarding-step gating added in Phase 1)
- S3 bucket created, `lib/s3.ts` with presigned-URL helper, `app/api/uploads/presign/route.ts`
- Base layout shell: root layout, Shadcn theme tokens applied per `design.md` section 3

**Exit criteria**: a user can sign up, log in, log out; DB schema migrated on Neon; a test image can be presigned and uploaded to S3 from a throwaway test page.

## Phase 1 — Onboarding Flow

**Deliverables**
- `app/(onboarding)/onboarding/shop` — shop name + GSTIN form (Zod validation for GSTIN format), server action creates `shops` row with `onboarding_step = shop_details`
- `app/(onboarding)/onboarding/category` — category grid (from seeded `shop_categories`), server action updates `shops.category` and `onboarding_step = category`
- `app/(onboarding)/onboarding/first-product` — simplified product form (name, price, one image via S3 presign, quantity), server action creates first `products` row and sets `onboarding_step = completed`
- `middleware.ts` updated: redirects merchants with incomplete `onboarding_step` into the correct wizard step; completed merchants skip straight to `/dashboard`
- Step indicator component per `design.md` onboarding section

**Exit criteria**: a fresh signup cannot reach `/dashboard` without completing all three steps in order; refreshing mid-wizard resumes at the correct step; completing the wizard lands on `/dashboard`.

## Phase 2 — Dashboard: Products, Orders, Analytics

**Deliverables**
- `app/(dashboard)/dashboard` — analytics home: revenue (week/month toggle), order count, recent orders list, empty state with storefront link per `design.md`
- `app/(dashboard)/dashboard/products` — list (table/card per breakpoint), create/edit pages, image upload, archive action
- `app/(dashboard)/dashboard/orders` — list with status-tab filters, detail view, constrained status-transition action
- `actions/products.ts`, `actions/orders.ts` — server actions, each scoped to the authenticated merchant's `shop_id` (never trust client-supplied ids)
- Shadcn components used: `Table`, `Badge`, `Sheet`, `Skeleton`, `Form`, `AlertDialog`, `sonner` toasts

**Exit criteria**: a merchant can add/edit/archive products, see them reflected on the (not-yet-public) storefront query, and manually create a test order (via direct DB insert or Phase 3 storefront) that appears correctly in the orders list with working status transitions.

## Phase 3 — Public Storefront + Checkout

**Deliverables**
- `app/u/[shopUsername]/page.tsx` — public shop page, product grid, no auth required, only `status = active` products/shops shown
- `app/u/[shopUsername]/p/[productSlug]` — product detail page
- Client-side cart (React context or localStorage-backed), `app/u/[shopUsername]/cart`
- `app/u/[shopUsername]/checkout` — name/phone/address form, server action creates `orders` + `order_items` with `payment_status = unpaid`, `delivery_mode = self`
- Copy per `design.md` reflecting "pay on delivery / store will confirm" expectation

**Exit criteria**: an anonymous browser session can visit a merchant's storefront, add items to cart, and complete checkout, producing an order visible in that merchant's dashboard orders list.

## Phase 4 — Settings + Public Link

**Deliverables**
- `app/(dashboard)/dashboard/settings` — sectioned per `design.md`: Shop Profile (edit name/logo/description), Storefront Link (read-only field + copy button + "view store" link), Payments (disabled "coming soon" card), Delivery (disabled "coming soon" card)
- `actions/shops.ts` — profile update action

**Exit criteria**: merchant can edit shop profile and copy their public storefront link; disabled future sections render but are non-interactive.

## Phase 5 — Future: Payments + Delivery Integration (not built now)

**Scope when this phase starts**
- Wire `payout_accounts`: bank account form, verification flow (likely via a payment aggregator that supports Indian bank payouts), update `orders.payment_status` on real payment events via `app/api/webhooks/`
- Wire `delivery_configs`: connect to in-house delivery service, update `orders.delivery_mode` and add delivery tracking fields/status
- Both integrate additively against the existing schema placeholders — no breaking migration expected if Phase 0–4 schema was followed correctly

**Exit criteria**: defined when this phase is actually scoped; not part of current build.

## Scalability Checkpoints (revisit, don't pre-build)

- If Neon connection/compute limits are hit: upgrade Neon plan; no code change needed (serverless driver already used)
- If S3 bandwidth grows: add CloudFront in front of the bucket, update `lib/s3.ts` URLs only
- If dashboard/storefront traffic patterns diverge significantly: split into Turborepo (`apps/dashboard`, `apps/storefront`, `packages/db`, `packages/ui`) — current route-group boundaries make this mechanical
- If analytics queries get expensive at scale: introduce materialized views or a scheduled aggregation job before reaching for a separate analytics service

## How to Use This Plan

Start every new session by checking which phase is in progress. Do not jump ahead to a later phase's UI even if it seems quick — schema placeholders exist precisely so later phases don't require rework. Update this file's phase status (mark deliverables done) as work completes so future sessions pick up correctly.
