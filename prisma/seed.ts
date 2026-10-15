import "dotenv/config";
import bcrypt from "bcryptjs";
import { db } from "../src/lib/db";
import { SYSTEM_ITEM_TYPES } from "../src/lib/constants/item-types";
import { DEMO_COLLECTIONS, DEMO_USER } from "./seed-data";

const BCRYPT_ROUNDS = 12;

// Idempotent: system types are matched by slug (userId = null), so re-running updates them in place.
// Prisma can't upsert on the [userId, slug] compound key when userId is null, hence find + update/create.
// Returns a slug → id map for linking items to their type.
async function seedSystemItemTypes() {
  const typeIds = new Map<string, string>();

  for (const { slug, name, icon, color } of SYSTEM_ITEM_TYPES) {
    const data = { name, icon, color, isSystem: true };
    const existing = await db.itemType.findFirst({ where: { slug, userId: null } });

    const type = existing
      ? await db.itemType.update({ where: { id: existing.id }, data })
      : await db.itemType.create({ data: { ...data, slug } });

    typeIds.set(slug, type.id);
  }

  console.log(`Seeded ${SYSTEM_ITEM_TYPES.length} system item types`);
  return typeIds;
}

async function seedDemoUser() {
  const password = await bcrypt.hash(DEMO_USER.password, BCRYPT_ROUNDS);
  const data = { name: DEMO_USER.name, password, isPro: false, emailVerified: new Date() };

  const user = await db.user.upsert({
    where: { email: DEMO_USER.email },
    update: data,
    create: { ...data, email: DEMO_USER.email },
  });

  console.log(`Seeded demo user ${user.email}`);
  return user;
}

// Wipes and recreates the demo user's content so re-running the seed never duplicates it.
async function seedDemoContent(userId: string, typeIds: Map<string, string>) {
  await db.item.deleteMany({ where: { userId } });
  await db.collection.deleteMany({ where: { userId } });

  let itemCount = 0;

  for (const { name, description, items } of DEMO_COLLECTIONS) {
    const collection = await db.collection.create({ data: { name, description, userId } });

    for (const { type, ...item } of items) {
      await db.item.create({
        data: {
          ...item,
          contentType: type === "links" ? "URL" : "TEXT",
          userId,
          typeId: typeIds.get(type)!,
          collections: { create: { collectionId: collection.id } },
        },
      });
    }

    itemCount += items.length;
  }

  console.log(`Seeded ${DEMO_COLLECTIONS.length} collections and ${itemCount} items`);
}

async function main() {
  const typeIds = await seedSystemItemTypes();
  const user = await seedDemoUser();
  await seedDemoContent(user.id, typeIds);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => db.$disconnect());
