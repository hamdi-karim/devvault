import "dotenv/config";
import { db } from "../src/lib/db";
import { SYSTEM_ITEM_TYPES } from "../src/lib/constants/item-types";

// Idempotent: system types are matched by slug (userId = null), so re-running updates them in place.
// Prisma can't upsert on the [userId, slug] compound key when userId is null, hence find + update/create.
async function seedSystemItemTypes() {
  for (const { slug, name, icon, color } of SYSTEM_ITEM_TYPES) {
    const data = { name, icon, color, isSystem: true };
    const existing = await db.itemType.findFirst({ where: { slug, userId: null } });

    if (existing) {
      await db.itemType.update({ where: { id: existing.id }, data });
    } else {
      await db.itemType.create({ data: { ...data, slug } });
    }
  }

  console.log(`Seeded ${SYSTEM_ITEM_TYPES.length} system item types`);
}

seedSystemItemTypes()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => db.$disconnect());
