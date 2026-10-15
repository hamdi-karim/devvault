import type { Metadata } from "next";

import { CollectionCard } from "@/components/dashboard/CollectionCard";
import { DashboardSection } from "@/components/dashboard/DashboardSection";
import { ItemCard } from "@/components/dashboard/ItemCard";
import { StatsCards } from "@/components/dashboard/StatsCards";
import { getCollectionStats, getRecentCollections } from "@/lib/db/collections";
import { itemTypes, items, type MockItem } from "@/lib/mock-data";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Dashboard · DevVault",
};

const RECENT_COLLECTIONS_LIMIT = 6;
const RECENT_ITEMS_LIMIT = 10;

const itemStats = {
  items: itemTypes.reduce((total, type) => total + type.itemCount, 0),
  favoriteItems: items.filter((item) => item.isFavorite).length,
};

const pinnedItems = items.filter((item) => item.isPinned);
const recentItems = [...items]
  .sort((a, b) => Date.parse(b.lastUsedAt) - Date.parse(a.lastUsedAt))
  .slice(0, RECENT_ITEMS_LIMIT);

function pluralize(count: number, noun: string) {
  return `${count} ${noun}${count === 1 ? "" : "s"}`;
}

function ItemGrid({ items: gridItems }: { items: MockItem[] }) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {gridItems.map((item) => (
        <ItemCard
          key={item.id}
          item={item}
          type={itemTypes.find((type) => type.id === item.typeId)}
        />
      ))}
    </div>
  );
}

export default async function DashboardPage() {
  const [recentCollections, collectionStats] = await Promise.all([
    getRecentCollections(RECENT_COLLECTIONS_LIMIT),
    getCollectionStats(),
  ]);
  const stats = { ...itemStats, ...collectionStats };

  return (
    <div className="mx-auto max-w-6xl space-y-10">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Dashboard</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {pluralize(stats.items, "item")} across {pluralize(stats.collections, "collection")}
        </p>
      </div>

      <StatsCards stats={stats} />

      <DashboardSection
        title="Recent collections"
        meta={pluralize(recentCollections.length, "collection")}
      >
        <div className="grid gap-4 md:grid-cols-2">
          {recentCollections.map((collection) => (
            <CollectionCard key={collection.id} collection={collection} />
          ))}
        </div>
      </DashboardSection>

      {pinnedItems.length > 0 && (
        <DashboardSection title="Pinned" meta={pluralize(pinnedItems.length, "item")}>
          <ItemGrid items={pinnedItems} />
        </DashboardSection>
      )}

      <DashboardSection title="Recent items" meta={pluralize(recentItems.length, "item")}>
        <ItemGrid items={recentItems} />
      </DashboardSection>
    </div>
  );
}
