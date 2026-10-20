import { FolderHeart, FolderOpen, Layers, type LucideIcon, Star } from "lucide-react";

import { Card } from "@/components/ui/card";

export interface DashboardStats {
  items: number;
  collections: number;
  favoriteItems: number;
  favoriteCollections: number;
}

interface StatCard {
  label: string;
  value: number;
  icon: LucideIcon;
}

interface StatsCardsProps {
  stats: DashboardStats;
}

export function StatsCards({ stats }: StatsCardsProps) {
  const cards: StatCard[] = [
    { label: "Items", value: stats.items, icon: Layers },
    { label: "Collections", value: stats.collections, icon: FolderOpen },
    { label: "Favorite items", value: stats.favoriteItems, icon: Star },
    { label: "Favorite collections", value: stats.favoriteCollections, icon: FolderHeart },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {cards.map(({ label, value, icon: Icon }) => (
        <Card key={label} className="flex-row items-center justify-between gap-3 px-4">
          <div className="min-w-0">
            <p className="truncate text-xs text-muted-foreground">{label}</p>
            <p className="text-2xl font-semibold tabular-nums">{value}</p>
          </div>
          <Icon className="size-5 shrink-0 text-muted-foreground" />
        </Card>
      ))}
    </div>
  );
}
