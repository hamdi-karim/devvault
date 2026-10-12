import { File, Pin, Star } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { formatRelativeTime } from "@/lib/format";
import { ITEM_TYPE_ICONS } from "@/lib/item-type-icons";
import type { MockItem, MockItemType } from "@/lib/mock-data";
import { typeColorVar } from "@/lib/type-color";

const FALLBACK_COLOR = "#6b7280";

interface ItemCardProps {
  item: MockItem;
  type: MockItemType | undefined;
}

function ItemPreview({ item }: { item: MockItem }) {
  if (item.url) {
    return <p className="truncate text-sm text-muted-foreground">{item.url}</p>;
  }

  if (item.language && item.content) {
    return <p className="truncate font-mono text-sm text-muted-foreground">{item.content}</p>;
  }

  return (
    <p className="line-clamp-2 text-sm text-muted-foreground">
      {item.content ?? item.description}
    </p>
  );
}

export function ItemCard({ item, type }: ItemCardProps) {
  const Icon = (type && ITEM_TYPE_ICONS[type.icon]) ?? File;

  return (
    <article
      style={typeColorVar(type?.color ?? FALLBACK_COLOR)}
      className="flex flex-col gap-2 rounded-xl border border-l-3 border-l-(--type-color) bg-card p-5 transition-colors hover:bg-muted/40"
    >
      <div className="flex items-center justify-between gap-2 text-xs">
        <span className="flex items-center gap-1.5 font-medium text-(--type-color)">
          <Icon className="size-3.5" />
          {type?.name ?? "Item"}
        </span>
        <span className="flex items-center gap-1.5 text-muted-foreground">
          {item.isFavorite && <Star className="size-3.5 fill-yellow-400 text-yellow-400" />}
          {item.isPinned && <Pin className="size-3.5" />}
          {formatRelativeTime(item.lastUsedAt)}
        </span>
      </div>
      <h3 className="font-semibold">{item.title}</h3>
      <ItemPreview item={item} />
      {item.tags.length > 0 && (
        <div className="mt-auto flex flex-wrap gap-1.5 pt-2">
          {item.tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="font-mono">
              {tag}
            </Badge>
          ))}
        </div>
      )}
    </article>
  );
}
