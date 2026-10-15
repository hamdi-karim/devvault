# Current Feature

<!-- Feature name and short description -->

## Feature Status

<!-- Not started | In progress | Completed -->

## Goals

<!-- Goals and Requirements -->

## Notes

<!-- Any extra notes -->

## History

<!-- Keep this updated, Earliest to Latest -->

- **Next.js project setup** (Completed): Initialized Next.js 16 + React 19 + TypeScript (strict) with Tailwind CSS v4 and ESLint (flat config, `eslint-config-next`).
- **Dashboard UI Phase 1** (Completed): Initialized shadcn/ui (`base-nova` style, Button/Input/Kbd), dark mode by default, `/dashboard` route with layout shell, display-only top bar (search + New button), and Sidebar/Main placeholders.
- **Dashboard UI Phase 2** (Completed): Collapsible sidebar via shadcn `Sidebar` (icon rail on desktop, drawer on mobile, top-bar trigger, cookie-persisted state), item types linking to `/items/[slug]` with counts and PRO badges, favorite and recent collections with dominant-type color dots, and user avatar area. Added `src/lib/collections.ts` and `src/lib/item-type-icons.ts` helpers.
- **Dashboard UI Phase 3** (Completed): Main dashboard area with 4 stats cards (items, collections, favorite items, favorite collections), recent collection cards tinted by dominant type, pinned items and 10 most recent items as type-colored cards with type icons, relative times and tags. Added shadcn Card/Badge, `src/components/dashboard/*`, and `src/lib/type-color.ts` + `src/lib/format.ts` helpers.
- **Prisma + Neon PostgreSQL Setup** (Completed): Prisma 7 (`prisma-client` generator → `src/generated/prisma`, gitignored, `postinstall` generate) with the Neon driver adapter. Initial schema (User/Auth.js models, Item, ItemType, Collection, ItemCollection, Tag) with indexes and cascade deletes; `init` migration plus a hand-added partial unique index on system type slugs. `prisma.config.ts` uses `DIRECT_URL` for the CLI, `src/lib/db.ts` uses pooled `DATABASE_URL` at runtime. Idempotent seed for the 7 system item types (`prisma/seed.ts`, `src/lib/constants/item-types.ts`), `scripts/test_db.ts` connection check, `npm run db:studio`, and `.env.example`.
- **Seed Data** (Completed): Rewrote `prisma/seed.ts` to seed the 7 system item types, a demo user (`demo@devvault.io`, bcryptjs-hashed password, 12 rounds) and 5 collections with 18 snippets, prompts, commands and links (`prisma/seed-data.ts`). Re-runs recreate the demo user's content without duplicates. `npm run db:test` now shows the demo user and its collections.
- **Dashboard Collections from Database** (Completed): Dashboard recent collection cards (up to 6) and collection stats now load from Neon via Prisma (`src/lib/db/collections.ts`: `getRecentCollections`, `getCollectionStats`), scoped to the demo user until auth exists. Card color comes from the most-used item type, computed at query time in a single query, and each card shows small icons for the types it contains. Dashboard page is now an async, dynamically rendered server component. Item stats, pinned/recent items and the sidebar remain on mock data.
