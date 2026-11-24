import { FolderOpen, Layers } from "lucide-react";

import { Card } from "@/components/ui/card";
import type { SidebarItemType } from "@/lib/db/items";
import { ITEM_TYPE_ICONS } from "@/lib/item-type-icons";
import { typeColorVar } from "@/lib/type-color";

interface ProfileStatsProps {
  items: number;
  collections: number;
  itemTypes: SidebarItemType[];
}

export function ProfileStats({ items, collections, itemTypes }: ProfileStatsProps) {
  const totals = [
    { label: "Total items", value: items, icon: Layers },
    { label: "Total collections", value: collections, icon: FolderOpen },
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        {totals.map(({ label, value, icon: Icon }) => (
          <Card key={label} className="flex-row items-center justify-between gap-3 px-4">
            <div className="min-w-0">
              <p className="truncate text-xs text-muted-foreground">{label}</p>
              <p className="text-2xl font-semibold tabular-nums">{value}</p>
            </div>
            <Icon className="size-5 shrink-0 text-muted-foreground" />
          </Card>
        ))}
      </div>

      <Card className="px-4">
        <ul className="grid gap-x-8 gap-y-3 sm:grid-cols-2">
          {itemTypes.map((type) => {
            const Icon = ITEM_TYPE_ICONS[type.icon] ?? ITEM_TYPE_ICONS.File;
            return (
              <li key={type.id} style={typeColorVar(type.color)} className="flex items-center gap-3 text-sm">
                <Icon className="size-4 shrink-0 text-(--type-color)" />
                <span>{type.name}s</span>
                <span className="ml-auto text-muted-foreground tabular-nums">{type.itemCount}</span>
              </li>
            );
          })}
        </ul>
      </Card>
    </div>
  );
}
