# AGENT.md — Operating Rules for Kirana

This file governs how any Claude session (or other coding agent) works in this repository. Read this, `design.md`, and `plan.md` before writing code. These three files are the source of truth — if code disagrees with them, either the code is wrong or the docs need a deliberate update (never silently drift).

## Product in One Line

Kirana is a multi-tenant e-commerce platform: shop owners sign up as merchants, complete a guided onboarding, manage products/orders/analytics from a dashboard, and get a public storefront at `{siteurl}/u/{shop-username}`.

## Tech Stack (locked — do not swap without explicit user approval)

- Next.js 15, App Router, Server Components + Server Actions
- Better Auth for authentication (session-based, Drizzle adapter)
- Neon Postgres via `@neondatabase/serverless`
- Drizzle ORM + drizzle-kit for schema/migrations
- AWS S3 for image storage (presigned URL uploads, never proxy binary through the server)
- Tailwind CSS + Shadcn/ui components
- Zod for all validation, shared between client forms and server actions
- React Hook Form for client-side forms
- Deployed on Vercel

Do not introduce a second ORM, a second auth library, a state management library (Redux/Zustand/Jotai), or a CSS-in-JS solution. If a real need arises, raise it with the user first.

## Folder Conventions

Follow the structure in `plan.md` section 2 exactly. Specifically:

- `app/(marketing)`, `app/(auth)`, `app/(onboarding)`, `app/(dashboard)` — route groups, no shared layout leakage between them
- `app/u/[shopUsername]` — public storefront, must never require auth to view
- `db/schema/*.ts` — one file per domain (shops, products, orders, etc.), never one giant schema file
- `actions/*.ts` — server actions grouped by domain, colocated with the domain they mutate, not by page
- `lib/validations/*.ts` — Zod schemas, imported by both the form (client) and the server action (server) — never duplicate a schema
- `components/ui/` — Shadcn primitives only. Add new primitives via `npx shadcn add <component>`, never hand-roll a component that Shadcn already provides
- `components/dashboard/`, `components/storefront/`, `components/shared/` — composed components, organized by which side of the product they serve

## Code Style Rules

- **No comments, ever.** Not `// eslint-disable` explanations, not JSDoc, not section dividers. Code must be self-explanatory through naming. If a rule truly needs justification that isn't obvious from code (a workaround for a specific library bug), that's the rare exception — keep it to one line, and prefer fixing the root cause instead.
- No unnecessary Tailwind classNames. Don't add wrapper divs or utility classes that don't affect rendering. Don't chain redundant spacing/sizing utilities when a Shadcn default already handles it.
- Server Actions over API routes for all mutations that originate from the dashboard or storefront UI. Reserve `app/api/*` for things that must be an HTTP endpoint (S3 presign, future webhooks).
- Prefer Server Components by default. Add `"use client"` only where interactivity (forms, cart state, copy-to-clipboard) requires it.
- Money is always stored and computed as integer paise (never float). Format to rupees only at the display layer.
- Every table/column name is `snake_case` in Postgres; Drizzle schema maps to `camelCase` in TypeScript.
- No premature abstraction: don't build a generic "form builder" or "CRUD factory" for a single onboarding wizard. Three similar page components are fine.

## Auth & Access Rules

- `middleware.ts` is the single place that gates `(dashboard)` routes: it checks session validity and `shops.onboarding_step`. Don't duplicate this check ad hoc in individual pages.
- The storefront (`app/u/**`) must never import from `lib/auth.ts` server config in a way that forces a session check — it's public.
- Never trust `shopUsername` or `productSlug` route params without a DB lookup scoped to `status = active`; a merchant's own dashboard queries are scoped by `merchant_id` from the session, never by trusting a client-supplied shop/merchant id.

## Testing Expectations

- New server actions that mutate money-relevant data (orders, products, payouts) get at least one test verifying the happy path and one verifying a rejection path (invalid input, unauthorized shop).
- Prefer integration-style tests against a test Neon branch/db over mocking Drizzle.
- UI changes: manually verify in the browser (dev server) before marking a task complete, per the golden-path + edge case testing standard.

## Git/Commit Conventions

- Conventional commit style: `feat:`, `fix:`, `chore:`, `refactor:` prefixes.
- One logical change per commit; don't bundle schema migrations with unrelated UI changes.
- Never commit `.env`, S3 credentials, or Neon connection strings.

## Source of Truth Hierarchy

1. Explicit instruction from the user in the current session
2. `plan.md` — what phase we're in and what's in/out of scope right now
3. `design.md` — UX/visual intent for any page being built or touched
4. `AGENT.md` (this file) — how to write the code
5. Existing code patterns in the repo (once they exist) — follow established precedent over inventing a new pattern

When in doubt about scope creep: build only what the current `plan.md` phase calls for. Future phases (payments, delivery) get schema placeholders only, never partial UI.


<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
