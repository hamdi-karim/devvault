import "dotenv/config";
import bcrypt from "bcryptjs";
import { db } from "../src/lib/db";
import { DEMO_USER } from "../prisma/seed-data";

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

  await testDemoData();
}

async function testDemoData() {
  const user = await db.user.findUnique({ where: { email: DEMO_USER.email } });
  if (!user) {
    console.log(`\n⚠️  Demo user ${DEMO_USER.email} not found. Run \`npm run db:seed\`.`);
    return;
  }

  const passwordOk = user.password ? await bcrypt.compare(DEMO_USER.password, user.password) : false;
  console.log("\n👤 Demo user:");
  console.table({
    email: user.email,
    name: user.name,
    isPro: user.isPro,
    emailVerified: user.emailVerified?.toISOString() ?? null,
    passwordMatches: passwordOk,
  });

  const collections = await db.collection.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "asc" },
    include: {
      items: {
        orderBy: { addedAt: "asc" },
        include: { item: { include: { type: { select: { name: true } } } } },
      },
    },
  });

  console.log(`\n🗂️  Demo collections (${collections.length}):`);
  for (const collection of collections) {
    console.log(`\n${collection.name} (${collection.items.length} items): ${collection.description}`);
    console.table(
      collection.items.map(({ item }) => ({
        type: item.type.name,
        title: item.title,
        contentType: item.contentType,
        language: item.language ?? "",
        url: item.url ?? "",
      })),
    );
  }
}

testDb()
  .catch((error) => {
    console.error("❌ Database test failed:", error);
    process.exitCode = 1;
  })
  .finally(() => db.$disconnect());
