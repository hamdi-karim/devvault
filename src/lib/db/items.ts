import type { Prisma } from "@/generated/prisma/client";
import { SYSTEM_ITEM_TYPES } from "@/lib/constants/item-types";
import { db } from "@/lib/db";
import { userScope } from "@/lib/db/scope";

export interface DashboardItemType {
  slug: string;
  name: string;
  icon: string;
  color: string;
}

export interface DashboardItem {
  id: string;
  title: string;
  description: string | null;
  content: string | null;
  language: string | null;
  url: string | null;
  isFavorite: boolean;
  isPinned: boolean;
  // Last used time, falling back to last update for items never opened.
  lastUsedAt: string;
  type: DashboardItemType;
  tags: string[];
}

export interface SidebarItemType extends DashboardItemType {
  id: string;
  proOnly: boolean;
  itemCount: number;
}

export interface ItemStats {
  items: number;
  favoriteItems: number;
}

const itemSelect = {
  id: true,
  title: true,
  description: true,
  content: true,
  language: true,
  url: true,
  isFavorite: true,
  isPinned: true,
  lastUsedAt: true,
  updatedAt: true,
  type: { select: { slug: true, name: true, icon: true, color: true } },
  tags: { select: { name: true }, orderBy: { name: "asc" } },
} satisfies Prisma.ItemSelect;

// Most recently used first; never-used items fall back to last update.
const recentFirst = [
  { lastUsedAt: { sort: "desc", nulls: "last" } },
  { updatedAt: "desc" },
] satisfies Prisma.ItemOrderByWithRelationInput[];

type SelectedItem = Prisma.ItemGetPayload<{ select: typeof itemSelect }>;

function toDashboardItem({ lastUsedAt, updatedAt, tags, ...item }: SelectedItem): DashboardItem {
  return {
    ...item,
    lastUsedAt: (lastUsedAt ?? updatedAt).toISOString(),
    tags: tags.map((tag) => tag.name),
  };
}

export async function getPinnedItems(): Promise<DashboardItem[]> {
  const items = await db.item.findMany({
    where: { ...userScope, isPinned: true },
    orderBy: recentFirst,
    select: itemSelect,
  });

  return items.map(toDashboardItem);
}

export async function getRecentItems(limit: number): Promise<DashboardItem[]> {
  const items = await db.item.findMany({
    where: userScope,
    orderBy: recentFirst,
    take: limit,
    select: itemSelect,
  });

  return items.map(toDashboardItem);
}

// System item types in their seeded order, with the user's item count for each.
export async function getSystemItemTypes(): Promise<SidebarItemType[]> {
  const types = await db.itemType.findMany({
    where: { isSystem: true },
    select: {
      id: true,
      slug: true,
      name: true,
      icon: true,
      color: true,
      _count: { select: { items: { where: userScope } } },
    },
  });

  const order = SYSTEM_ITEM_TYPES.map((type) => type.slug as string);

  return types
    .map(({ _count, ...type }) => ({
      ...type,
      proOnly: SYSTEM_ITEM_TYPES.some((system) => system.slug === type.slug && system.proOnly),
      itemCount: _count.items,
    }))
    .sort((a, b) => order.indexOf(a.slug) - order.indexOf(b.slug));
}

export async function getItemStats(): Promise<ItemStats> {
  const [items, favoriteItems] = await Promise.all([
    db.item.count({ where: userScope }),
    db.item.count({ where: { ...userScope, isFavorite: true } }),
  ]);

  return { items, favoriteItems };
}
