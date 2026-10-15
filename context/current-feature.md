# Current Feature

**Seed Data**: rewrite `prisma/seed.ts` to populate the database with a demo user, collections and items for development and demos. Spec: @context/features/seed-spec.md

## Feature Status

In progress

## Goals

- **System item types**: keep seeding the 7 system types from `SYSTEM_ITEM_TYPES` (`isSystem: true`, `userId: null`)
- **Demo user**:
  - Email `demo@devvault.io`, name `Demo User`
  - Password `12345678`, hashed with `bcryptjs` (12 rounds)
  - `isPro: false`, `emailVerified: new Date()`
- **Collections & items** (all owned by the demo user):
  - **React Patterns** (_Reusable React patterns and hooks_): 3 TypeScript snippets (custom hooks such as useDebounce/useLocalStorage, component patterns such as context providers/compound components, utility functions)
  - **AI Workflows** (_AI prompts and workflow automations_): 3 prompts (code review, documentation generation, refactoring assistance)
  - **DevOps** (_Infrastructure and deployment resources_): 1 snippet (Docker / CI/CD config), 1 command (deployment script), 2 links (real documentation URLs)
  - **Terminal Commands** (_Useful shell commands for everyday development_): 4 commands (git, Docker, process management, package manager utilities)
  - **Design Resources** (_UI/UX resources and references_): 4 links (real URLs: CSS/Tailwind reference, component library, design system, icon library)

## Notes

- Overwrite the current `prisma/seed.ts`. The existing system-type logic (find + update/create, because Prisma can't upsert on `[userId, slug]` when `userId` is null) can be reused.
- `bcryptjs` is not installed yet; add it as a dependency.
- Keep the seed idempotent: upsert the user by email, then delete and recreate the demo user's items and collections so re-running `npm run db:seed` doesn't duplicate data.
- Use the matching `contentType` per type (`TEXT` for snippets/prompts/commands, `URL` for links) and set `language` on snippets and commands for syntax highlighting.
- Assign items to collections through `ItemCollection` rows.
- Verify: run `npm run db:seed` twice, inspect with `npm run db:studio`, then `npm run build`.

## History

<!-- Keep this updated, Earliest to Latest -->

- **Next.js project setup** (Completed): Initialized Next.js 16 + React 19 + TypeScript (strict) with Tailwind CSS v4 and ESLint (flat config, `eslint-config-next`).
- **Dashboard UI Phase 1** (Completed): Initialized shadcn/ui (`base-nova` style, Button/Input/Kbd), dark mode by default, `/dashboard` route with layout shell, display-only top bar (search + New button), and Sidebar/Main placeholders.
- **Dashboard UI Phase 2** (Completed): Collapsible sidebar via shadcn `Sidebar` (icon rail on desktop, drawer on mobile, top-bar trigger, cookie-persisted state), item types linking to `/items/[slug]` with counts and PRO badges, favorite and recent collections with dominant-type color dots, and user avatar area. Added `src/lib/collections.ts` and `src/lib/item-type-icons.ts` helpers.
- **Dashboard UI Phase 3** (Completed): Main dashboard area with 4 stats cards (items, collections, favorite items, favorite collections), recent collection cards tinted by dominant type, pinned items and 10 most recent items as type-colored cards with type icons, relative times and tags. Added shadcn Card/Badge, `src/components/dashboard/*`, and `src/lib/type-color.ts` + `src/lib/format.ts` helpers.
- **Prisma + Neon PostgreSQL Setup** (Completed): Prisma 7 (`prisma-client` generator → `src/generated/prisma`, gitignored, `postinstall` generate) with the Neon driver adapter. Initial schema (User/Auth.js models, Item, ItemType, Collection, ItemCollection, Tag) with indexes and cascade deletes; `init` migration plus a hand-added partial unique index on system type slugs. `prisma.config.ts` uses `DIRECT_URL` for the CLI, `src/lib/db.ts` uses pooled `DATABASE_URL` at runtime. Idempotent seed for the 7 system item types (`prisma/seed.ts`, `src/lib/constants/item-types.ts`), `scripts/test_db.ts` connection check, `npm run db:studio`, and `.env.example`.
