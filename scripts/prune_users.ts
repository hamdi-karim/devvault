import "dotenv/config";
import { db } from "../src/lib/db";
import { DEMO_USER } from "../prisma/seed-data";

// Deletes every user except the demo user, along with all of their content.
// Dry run by default; pass --confirm to actually delete.
// Uses DATABASE_URL from .env (the development branch). Never point this at production.

const CONFIRM = process.argv.includes("--confirm");

function databaseHost(): string {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL is not set. Copy .env.example to .env and fill it in.");
  return new URL(url).host;
}

async function pruneUsers() {
  console.log(`Database: ${databaseHost()}`);

  const users = await db.user.findMany({
    where: { email: { not: DEMO_USER.email } },
    select: { id: true, email: true, _count: { select: { items: true, collections: true } } },
    orderBy: { createdAt: "asc" },
  });

  if (users.length === 0) {
    console.log(`Nothing to delete: ${DEMO_USER.email} is the only user.`);
    return;
  }

  console.log(`\nUsers to delete (keeping ${DEMO_USER.email}):`);
  console.table(
    users.map((u) => ({ email: u.email, items: u._count.items, collections: u._count.collections })),
  );

  if (!CONFIRM) {
    console.log("\nDry run: nothing was deleted. Re-run with --confirm to delete these users.");
    return;
  }

  const ids = users.map((u) => u.id);
  const emails = users.map((u) => u.email);

  // Items go first: they reference item types with onDelete: Restrict, so deleting a user's
  // custom types before their items would fail. Everything else cascades from User.
  // Verification tokens have no relation to User, so they're removed by email.
  const [items, tokens, deleted] = await db.$transaction([
    db.item.deleteMany({ where: { userId: { in: ids } } }),
    db.verificationToken.deleteMany({ where: { identifier: { in: emails } } }),
    db.user.deleteMany({ where: { id: { in: ids } } }),
  ]);

  console.log(
    `\nDeleted ${deleted.count} users, ${items.count} items and ${tokens.count} verification tokens.`,
  );
  console.log("Their collections, tags, custom types, accounts and sessions were removed by cascade.");
}

pruneUsers()
  .catch((error) => {
    console.error("Pruning failed:", error);
    process.exitCode = 1;
  })
  .finally(() => db.$disconnect());
