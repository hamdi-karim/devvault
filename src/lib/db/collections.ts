import { db } from "@/lib/db";

// No auth yet: dashboard data is scoped to the seeded demo user.
const DEMO_USER_EMAIL = "demo@devvault.io";
const FALLBACK_COLOR = "#6b7280";

export interface CollectionTypeCount {
  slug: string;
  name: string;
  icon: string;
  color: string;
  count: number;
}

export interface DashboardCollection {
  id: string;
  name: string;
  description: string | null;
  isFavorite: boolean;
  itemCount: number;
  color: string;
  // Item types in the collection, most-used first.
  types: CollectionTypeCount[];
}

export interface CollectionStats {
  collections: number;
  favoriteCollections: number;
}

const userScope = { user: { email: DEMO_USER_EMAIL } };

function countTypes(types: Omit<CollectionTypeCount, "count">[]): CollectionTypeCount[] {
  const counts = new Map<string, CollectionTypeCount>();

  for (const type of types) {
    const entry = counts.get(type.slug);
    if (entry) entry.count += 1;
    else counts.set(type.slug, { ...type, count: 1 });
  }

  return [...counts.values()].sort((a, b) => b.count - a.count);
}

// Most recently updated collections, with item types counted in one query.
export async function getRecentCollections(limit: number): Promise<DashboardCollection[]> {
  const collections = await db.collection.findMany({
    where: userScope,
    orderBy: { updatedAt: "desc" },
    take: limit,
    select: {
      id: true,
      name: true,
      description: true,
      isFavorite: true,
      items: {
        select: {
          item: {
            select: { type: { select: { slug: true, name: true, icon: true, color: true } } },
          },
        },
      },
    },
  });

  return collections.map(({ items, ...collection }) => {
    const types = countTypes(items.map(({ item }) => item.type));
    return {
      ...collection,
      itemCount: items.length,
      color: types[0]?.color ?? FALLBACK_COLOR,
      types,
    };
  });
}

export async function getCollectionStats(): Promise<CollectionStats> {
  const [collections, favoriteCollections] = await Promise.all([
    db.collection.count({ where: userScope }),
    db.collection.count({ where: { ...userScope, isFavorite: true } }),
  ]);

  return { collections, favoriteCollections };
}
