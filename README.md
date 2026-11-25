# DevVault

Your dev knowledge, in one vault. Snippets, prompts, commands and links, searchable and AI-enhanced.

> In progress: authentication, the dashboard and the profile page are built. See the [project overview](context/project-overview.md) for planned features and the roadmap.

## Stack

Next.js 16, React 19, TypeScript, Prisma 7, Neon Postgres, Auth.js v5, Resend, Tailwind CSS v4 and shadcn/ui.

## Getting started

1. Install dependencies (this also generates the Prisma client):

   ```bash
   npm install
   ```

2. Copy `.env.example` to `.env` and fill in the values. Use a development database.

3. Apply the migrations, then seed the item types and demo user:

   ```bash
   npm run db:migrate
   npm run db:seed
   ```

4. Start the dev server at http://localhost:3000:

   ```bash
   npm run dev
   ```

## Commands

| Command | Description |
|---|---|
| `npm run dev` | Start the dev server |
| `npm run build` | Production build |
| `npm run lint` | Run ESLint |
| `npm run db:migrate -- --name <name>` | Create and apply a migration |
| `npm run db:migrate:status` | Check migration status |
| `npm run db:seed` | Seed the database |
| `npm run db:studio` | Open Prisma Studio |

Schema changes always go through migrations, never `prisma db push`.
