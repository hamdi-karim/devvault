import "dotenv/config";
import { defineConfig } from "prisma/config";

// The CLI (migrate, studio) uses Neon's direct connection when DIRECT_URL is set.
// The app uses the pooled DATABASE_URL at runtime (see src/lib/db.ts).
export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
  datasource: {
    url: process.env.DIRECT_URL ?? process.env.DATABASE_URL,
  },
});
