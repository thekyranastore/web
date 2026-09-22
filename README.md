# Kirana

Multi-tenant e-commerce platform. Merchants sign up, complete onboarding, and manage products/orders from a dashboard. Each shop gets a public storefront at `/u/{shop-username}`.

## Stack

- Next.js 16 (App Router, Server Components + Server Actions)
- Better Auth (Neon Auth) for sessions
- Neon Postgres + Drizzle ORM, with Row-Level Security enforcing tenant isolation
- AWS S3 for image storage (presigned uploads, client-side compression)
- Tailwind CSS + Shadcn/ui
- Zod + React Hook Form

## Getting Started

```bash
npm install
cp .env.example .env   # fill in DATABASE_URL, S3, and auth credentials
npm run db:push
npm run db:force-rls
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

- `npm run dev` / `build` / `start` — Next.js
- `npm run db:generate` / `db:migrate` / `db:push` / `db:studio` — Drizzle
- `npm run db:force-rls` — enforce RLS on tenant tables (run after any schema push)
- `npm run check:tenant` — static check for unscoped tenant queries
- `npm run lint`

## Project layout

See `AGENT.md` and `plan.md` for the full folder conventions, RLS design, and current build phase.
