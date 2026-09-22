# design.md — Kirana Product Design Language

Written from the perspective of a high-agency SaaS product designer. This is not a moodboard — it's a set of decisions. Every future screen either follows this or has an explicit, deliberate reason not to.

## 1. Who We're Designing For

A shop owner — often on a phone, often not a power user of software, often doing this between customers. They are trusting us with two sensitive things immediately: their GSTIN (a tax identity) and eventually their bank account. The design's first job is to earn that trust without slowing them down. This is not a "delightful consumer app" — it's a tool a small business owner should be able to trust and operate one-handed.

Design principle: **clarity and speed over decoration.** Every screen should answer "what do I do next" in under two seconds. No screen should require a tutorial.

## 2. Design Principles

1. **One primary action per screen.** Dashboard pages, onboarding steps, forms — always one obvious button that's the "next" thing. Secondary actions are visually secondary (ghost/outline variants, smaller, or in a menu).
2. **Mobile-first, not mobile-adapted.** Design the phone layout first; the desktop dashboard layout is the phone layout with more breathing room and a sidebar, not the other way around. Merchants will set up their shop and check orders from their phone.
3. **Trust through precision, not ornamentation.** Because GSTIN and money are involved, the UI should feel precise: aligned numbers, tabular figures for currency, clear confirmation states after every save. No cutesy illustrations on data screens — save personality for empty states and onboarding only.
4. **Progressive disclosure.** Onboarding asks for the minimum to get a merchant live (shop name, GSTIN, category, one product) — everything else (bank details, delivery integration, advanced settings) is deferred and clearly marked "coming soon" rather than hidden or half-built.
5. **Consistent, not novel.** Use Shadcn defaults as-is wherever possible. A merchant's trust in the platform comes from things behaving the way every other well-made SaaS tool behaves — don't reinvent a date picker or a table.

## 3. Visual System

**Reference**: Substack's creator dashboard (sidebar + content, orange accent) is the direct visual model for the merchant dashboard shell. We are not cloning Substack's product — we're adopting its restraint: a plain white canvas, one confident accent color, bold flat headings with no gradients or shadows, and generous whitespace instead of boxes-within-boxes. It reads as calm and premium precisely because it refuses to decorate.

### Theme tokens (Shadcn `new-york` style, Tailwind CSS variables)

- **Base style**: `new-york` (tighter, more professional than `default` — better fit for a business tool)
- **Radius**: `0.5rem` base — enough softness to feel modern, not so much it feels playful
- **Color roles** (defined as CSS variables, light + dark):
  - `background` / `foreground` — pure, flat near-white (`#ffffff`/`#fafafa`) in light mode, near-black text — no tinted greys pretending to be neutral. The canvas should feel as plain as paper.
  - `primary` — a single warm orange accent (`#FF6719`-range), evoking energy and "open for business" — used for the one primary button per screen, active sidebar item, link hover, and chart accent fills. This replaces the earlier green choice: orange reads as active/commerce rather than passive/financial, and matches the reference's single-accent restraint.
  - `sidebar` — its own token set (`sidebar-background`, `sidebar-foreground`, `sidebar-accent`) distinct from the main canvas: a very light warm-grey background, active item pill-highlighted with a soft tint of `primary`, not a full-color fill, so the sidebar stays quiet.
  - `muted` — for secondary text, disabled states, table zebra striping, un-selected sidebar icons
  - `destructive` — reserved strictly for delete/cancel/irreversible actions (cancel order, archive product, delete account)
  - `success` / `warning` — order status chips only (delivered = success-tinted, pending = warning-tinted, cancelled = destructive-tinted)
- **Typography**: `Plus Jakarta Sans` (via `next/font/google`, self-hosted at build time — no runtime CDN request) as `--font-sans`, falling back to the system sans stack. It's a geometric, slightly rounded grotesque that reads as friendly-but-professional and carries bold weights well for the oversized stat numbers and page titles this layout leans on; a plain system stack felt too flat once the sidebar/stat-card layout was in place. Page titles (`Podcasting`-style headers in the reference) are bold, large (`text-2xl`/`3xl`), and sit alone at the top of the content pane with no icon or breadcrumb clutter — the title *is* the orientation.
- **Numbers**: `tabular-nums` on all currency and quantity displays so columns align. Big stat numbers (dashboard overview cards) are extra-bold and oversized relative to their label, exactly like the reference's "Total downloads / 2" pattern — the number should be the loudest thing in the card.
- **Spacing scale**: stick to Tailwind's default scale (4px increments). No custom spacing tokens. Favor whitespace over borders: prefer a gap and a subtle 1px `border-border` divider over a filled card background when separating sections.

### Layout shell (dashboard)

- **Two-pane shell**: fixed-width light sidebar (~280px) on the left, full-bleed white content pane on the right. This is now the canonical dashboard layout — replaces any prior card-grid-first layout.
- **Sidebar structure, top to bottom**: workspace switcher (shop logo + name, dropdown chevron) → primary CTA button (`Add product` / `New order`, filled `primary`, full-width, pill-rounded) → grouped nav sections with small uppercase muted labels (`CONTENT`, `AUDIENCE`, `CREATOR TOOLS` in the reference → maps to `SHOP`, `ORDERS`, `SETTINGS` for Kirana) → icon+label nav items, active item shown via a light pill background, not a border or bold weight alone → utility links (`Help`, `Settings`) pinned to the bottom, visually separated from the main nav.
- **Content pane top bar**: page title left-aligned, a row of small icon-only ghost buttons right-aligned (search, notifications with a small `primary`-colored count badge, avatar menu). No breadcrumbs, no tabs in the top bar — page-level tabs (e.g., order status filters) live below the header instead.
- **Overview cards row**: 3-4 equal-width bordered (not shadowed) cards in a single row, each: small muted label on top, one oversized bold number below. No icons inside these cards — the number carries all the weight.
- **Trend chart**: a single line+area chart, `primary`-colored line with a soft gradient fill fading to transparent, minimal gridlines, axis labels in `muted`. A period/granularity dropdown pair sits top-right of the chart's own header row, mirroring the overview section's title+description pattern (bold title, muted one-line description underneath).

### Component usage patterns

- **Buttons**: `default` variant for the one primary action, filled with `primary` and pill-rounded (fully rounded corners, matching the reference's `New episode` button) — this is a deliberate deviation from the base Shadcn `0.5rem` radius for buttons specifically, everything else keeps standard radius. `outline` for secondary, `ghost` for tertiary/icon-only actions, `destructive` only for irreversible actions with a confirmation dialog.
- **Forms**: Shadcn `Form` + React Hook Form + Zod. Every field has a visible label (no placeholder-as-label anti-pattern). Inline validation errors below the field, not toasts.
- **Tables**: Shadcn `Table` for products/orders lists. Sticky header on scroll. Row click navigates to detail; explicit action buttons never nested inside a clickable row without `stopPropagation`.
- **Status/Badges**: Shadcn `Badge` with semantic color per order/product status, consistent mapping defined once (see below), reused everywhere.
- **Dialogs**: confirmation dialogs (`AlertDialog`) for destructive actions only. Regular forms open in a `Sheet` (side panel) on desktop for "quick add" flows (e.g., add product from list page) to avoid full navigation, but the full-page route always exists as canonical.
- **Toasts** (`sonner`): for async action feedback (saved, uploaded, error) — never for validation errors that belong inline.

### Status color mapping (single source of truth — do not redefine per page)

| Status | Color role |
|---|---|
| Order: pending | warning |
| Order: confirmed | primary/muted |
| Order: shipped | primary |
| Order: delivered | success |
| Order: cancelled | destructive |
| Product: draft | muted |
| Product: active | success |
| Product: archived | muted/outline |
| Payment: unpaid | warning |
| Payment: paid | success |

## 4. Page-by-Page Intent

### Auth (login/signup)
Minimal. Logo, one form, one primary button. No marketing copy competing for attention. Error states inline, not alert banners.

### Onboarding wizard
A visible step indicator (e.g., "Step 2 of 3") so the merchant knows how much is left — critical for a busy shop owner. Each step is a single focused question set:
1. Shop name + GSTIN — one short explainer line on why GSTIN is needed (tax compliance, builds trust that this isn't misused)
2. Category — a grid of tappable category cards with icons, not a dropdown (faster on mobile, more satisfying to select)
3. First product — a single simplified product form (name, price, one photo, quantity) with copy reassuring "you can add more details later" to lower the barrier to finishing setup

No skipping steps. Back navigation allowed; forward requires the current step's minimum valid data.

### Dashboard home (analytics)
Follows the layout shell described in §3: page title `Overview`, then a row of stat cards (Revenue, Orders, Avg. order value — same big-number-under-muted-label pattern), then a single revenue trend chart (`primary`-line, gradient fill, daily/weekly toggle + date-range dropdown top-right of the chart header), then a short recent-orders list below. On mobile the sidebar collapses to a bottom/hamburger nav and the stat cards stack to a 2-column grid — no dense charts requiring horizontal scroll on a phone; the trend chart is the one exception and simply gets shorter, not scrollable. Empty state (no orders yet) shows a friendly nudge: "Share your store link to get your first order" with the storefront link prominent and copyable right there, not buried in settings.

### Products page
List view first (table on desktop, card list on mobile), with a persistent "Add product" primary button. Product cards/rows show image thumbnail, name, price, stock, status badge. Empty state before first product doesn't really occur (onboarding forces one), but "no products match filter" gets a clear reset-filter action.

### Orders page
Filterable by status (tabs: All / Pending / Confirmed / Shipped / Delivered / Cancelled). Each row: order id, customer name, item count, total, status badge, date. Detail view: full item breakdown, customer contact/address, and a single dropdown/action to advance status — status transitions should be constrained to valid next-states only (don't let a cancelled order be marked delivered).

### Settings page
Sectioned, not a single long form: Shop Profile, Storefront Link (the `{siteurl}/u/{username}` field, read-only with a copy button and a "view store" link), Payments (bank account — disabled card, "Coming soon"), Delivery (in-house delivery — disabled card, "Coming soon"). Disabled future sections are visually present but clearly non-interactive (muted, no false affordance) so merchants know what's coming without being able to click into a half-built feature.

### Public storefront (`/u/{username}`)
This is the merchant's shopfront — it should feel like *their* store, not ours. Shop name/logo prominent at top, category shown as context, clean product grid (image-forward, price clear, tabular). Product detail: large image, price, quantity selector, add-to-cart. Cart: simple line-item list, editable quantities, clear total. Checkout: name/phone/address only for v1 (no payment gateway yet) — set expectation copy like "Pay on delivery" or "Store will contact you to confirm" so the missing payment step doesn't feel broken.

## 5. Empty, Loading, and Error States

- **Empty states**: always actionable — never just "No data." Pair with the one action that would resolve it (add product, share store link, clear filter).
- **Loading states**: Shadcn `Skeleton` matching the actual layout shape (skeleton table rows for tables, skeleton cards for grids) — never a generic spinner for content that has a known shape. A spinner is acceptable only for button-level async actions (submit, upload).
- **Error states**: inline and specific ("GSTIN format looks incorrect" not "Invalid input"). Network/server errors surface as a toast with a retry action where retry is possible.

## 6. Copy Tone

Direct, encouraging, no corporate jargon. Talk to the merchant like a helpful assistant, not a legal document. Examples:
- Good: "Add your first product to go live"
- Avoid: "Please complete the following mandatory field to proceed"

Keep every label a plain noun/verb a shop owner would use themselves (e.g., "Add product," not "Create new inventory item").
