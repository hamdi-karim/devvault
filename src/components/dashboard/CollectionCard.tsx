import Link from "next/link";
import { Star } from "lucide-react";

import type { DashboardCollection } from "@/lib/db/collections";
import { getItemTypeIcon } from "@/lib/item-type-icons";
import { typeColorVar } from "@/lib/type-color";

interface CollectionCardProps {
  collection: DashboardCollection;
}

// e.g. "12 snippets · 3 prompts", largest first.
function formatTypeCounts(collection: DashboardCollection) {
  return collection.types
    .map(({ name, slug, count }) => `${count} ${count === 1 ? name.toLowerCase() : slug}`)
    .join(" · ");
}

export function CollectionCard({ collection }: CollectionCardProps) {
  return (
    <Link
      href={`/collections/${collection.id}`}
      style={typeColorVar(collection.color)}
      className="group flex flex-col gap-2 rounded-xl border border-(--type-color)/30 bg-(--type-color)/8 p-5 transition-colors hover:border-(--type-color)/60 hover:bg-(--type-color)/12"
    >
      <div className="flex items-center justify-between">
        <span className="size-2.5 rounded-full bg-(--type-color)" />
        <span className="flex items-center gap-1.5 font-mono text-xs text-muted-foreground">
          {collection.isFavorite && <Star className="size-3.5 fill-yellow-400 text-yellow-400" />}
          {collection.itemCount} items
        </span>
      </div>
      <h3 className="mt-1 font-semibold">{collection.name}</h3>
      <p className="line-clamp-2 text-sm text-muted-foreground">{collection.description}</p>
      <div className="mt-auto flex items-center justify-between gap-3 pt-2">
        <p className="font-mono text-xs text-muted-foreground">{formatTypeCounts(collection)}</p>
        <div className="flex shrink-0 items-center gap-1.5">
          {collection.types.map((type) => {
            const Icon = getItemTypeIcon(type.icon);
            return (
              <span key={type.slug} title={type.name} style={typeColorVar(type.color)}>
                <Icon className="size-3.5 text-(--type-color)" />
              </span>
            );
          })}
        </div>
      </div>
    </Link>
  );
}
