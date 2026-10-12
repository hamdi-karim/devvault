import Link from "next/link";
import { Star } from "lucide-react";

import { getCollectionColor } from "@/lib/collections";
import type { MockCollection, MockItemType } from "@/lib/mock-data";
import { typeColorVar } from "@/lib/type-color";

interface CollectionCardProps {
  collection: MockCollection;
  itemTypes: MockItemType[];
}

// e.g. "12 snippets · 3 prompts", largest first.
function formatTypeCounts(collection: MockCollection, itemTypes: MockItemType[]) {
  return Object.entries(collection.typeCounts)
    .map(([slug, count = 0]) => ({ type: itemTypes.find((t) => t.slug === slug), count }))
    .filter(({ count }) => count > 0)
    .sort((a, b) => b.count - a.count)
    .map(({ type, count }) => {
      const label = count === 1 ? type?.name.toLowerCase() : type?.slug;
      return `${count} ${label ?? "items"}`;
    })
    .join(" · ");
}

export function CollectionCard({ collection, itemTypes }: CollectionCardProps) {
  return (
    <Link
      href={`/collections/${collection.id}`}
      style={typeColorVar(getCollectionColor(collection, itemTypes))}
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
      <p className="mt-auto pt-2 font-mono text-xs text-muted-foreground">
        {formatTypeCounts(collection, itemTypes)}
      </p>
    </Link>
  );
}
