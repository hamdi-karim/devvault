import type { Metadata } from "next";

import { CollectionCard } from "@/components/dashboard/CollectionCard";
import { DashboardSection } from "@/components/dashboard/DashboardSection";
import { ItemCard } from "@/components/dashboard/ItemCard";
import { StatsCards } from "@/components/dashboard/StatsCards";
import { getRecentCollections } from "@/lib/collections";
import { collections, itemTypes, items, type MockItem } from "@/lib/mock-data";

export const metadata: Metadata = {
  title: "Dashboard · DevVault",
};

const RECENT_COLLECTIONS_LIMIT = 4;
const RECENT_ITEMS_LIMIT = 10;

const stats = {
  items: itemTypes.reduce((total, type) => total + type.itemCount, 0),
  collections: collections.length,
  favoriteItems: items.filter((item) => item.isFavorite).length,
  favoriteCollections: collections.filter((collection) => collection.isFavorite).length,
};

const recentCollections = getRecentCollections(collections, items).slice(
  0,
  RECENT_COLLECTIONS_LIMIT,
);
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

export default function DashboardPage() {
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
            <CollectionCard key={collection.id} collection={collection} itemTypes={itemTypes} />
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
