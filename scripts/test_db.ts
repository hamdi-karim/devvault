import "dotenv/config";
import { db } from "../src/lib/db";

async function testDb() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not set. Copy .env.example to .env and fill it in.");
  }

  const [{ now }] = await db.$queryRaw<{ now: Date }[]>`SELECT NOW() AS now`;
  console.log(`✅ Connected to database (server time: ${now.toISOString()})`);

  const itemTypes = await db.itemType.findMany({
    where: { isSystem: true },
    select: { slug: true, name: true, icon: true, color: true },
    orderBy: { name: "asc" },
  });
  console.log(`\n📦 System item types (${itemTypes.length}):`);
  console.table(itemTypes);

  const [users, items, collections, tags] = await Promise.all([
    db.user.count(),
    db.item.count(),
    db.collection.count(),
    db.tag.count(),
  ]);
  console.log("\n📊 Row counts:");
  console.table({ users, items, collections, tags });
}

testDb()
  .catch((error) => {
    console.error("❌ Database test failed:", error);
    process.exitCode = 1;
  })
  .finally(() => db.$disconnect());
