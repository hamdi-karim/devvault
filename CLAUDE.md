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
- `npm run db:migrate -- --name <name>`: create and apply a migration (never `db push`)
- `npm run db:migrate:status`: check migrations are in sync (run before committing)
- `npm run db:migrate:deploy`: apply pending migrations in production/CI
- `npm run db:reset`: drop the dev database and reapply all migrations (destructive)
- `npm run db:generate`: regenerate the client into `src/generated/prisma` (also runs on `postinstall`; Prisma 7 `migrate dev` no longer does this)
- `npm run db:seed`: seed system item types (not run automatically by Prisma 7 migrate)
- `npm run db:studio`: open Prisma Studio
- `npm run db:test`: check the database connection and seeded data

No test framework is set up yet.
