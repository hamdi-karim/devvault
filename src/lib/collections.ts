import type { MockCollection, MockItem, MockItemType } from "@/lib/mock-data";

const FALLBACK_COLOR = "#6b7280";

// The color of the item type a collection holds the most of.
export function getCollectionColor(
  collection: MockCollection,
  itemTypes: MockItemType[],
): string {
  const [dominantSlug] = Object.entries(collection.typeCounts).reduce<
    [string | null, number]
  >(
    (best, [slug, count = 0]) => (count > best[1] ? [slug, count] : best),
    [null, 0],
  );

  return itemTypes.find((type) => type.slug === dominantSlug)?.color ?? FALLBACK_COLOR;
}

// Collections ordered by the most recent use of any item inside them.
export function getRecentCollections(
  collections: MockCollection[],
  items: MockItem[],
): MockCollection[] {
  const lastUsed = new Map<string, number>();

  for (const item of items) {
    const usedAt = Date.parse(item.lastUsedAt);
    for (const collectionId of item.collectionIds) {
      lastUsed.set(collectionId, Math.max(lastUsed.get(collectionId) ?? 0, usedAt));
    }
  }

  return [...collections].sort(
    (a, b) => (lastUsed.get(b.id) ?? 0) - (lastUsed.get(a.id) ?? 0),
  );
}
