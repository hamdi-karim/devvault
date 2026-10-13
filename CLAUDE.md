# DevVault

Your dev knowledge, in one vault. Snippets, prompts, commands and links, searchable and AI-enhanced.

## Context Files

Read the following to get the full context of the project:

- @context/project-overview.md
- @context/coding-standards.md
- @context/ai-interaction.md
- @context/current-feature.md

## Commands

- `npm run dev`: start the dev server at http://localhost:3000
- `npm run build`: production build (also type-checks)
- `npm run start`: serve the production build
- `npm run lint`: ESLint (flat config in `eslint.config.mjs`, using `eslint-config-next` core-web-vitals + typescript)
- `npx tsc --noEmit`: type-check without building
- `npx prisma migrate dev --name <name>`: create and apply a migration (never `db push`)
- `npx prisma migrate status`: check migrations are in sync (run before committing)
- `npx prisma generate`: regenerate the client into `src/generated/prisma` (also runs on `postinstall`; Prisma 7 `migrate dev` no longer does this)
- `npx prisma db seed`: seed system item types (not run automatically by Prisma 7 migrate)
- `npm run db:studio`: open Prisma Studio
- `npx tsx scripts/test_db.ts`: check the database connection and seeded data

No test framework is set up yet.
