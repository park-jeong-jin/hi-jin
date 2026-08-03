import Link from "next/link";
import { homeHref, tagLabel } from "@/lib/taxonomy";
import { toggleChipClass } from "@/lib/ui/tagChip";
import type { Tag } from "@/lib/taxonomy";

type PostFiltersProps = {
  tag?: Tag;
  availableTags: Tag[];
};

export function PostFilters({ tag, availableTags }: PostFiltersProps) {
  if (availableTags.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2">
      <Link href={homeHref()} className={toggleChipClass(!tag)}>
        전체
      </Link>
      {availableTags.map((item) => {
        const active = tag === item;
        return (
          <Link
            key={item}
            href={homeHref({ tag: active ? undefined : item })}
            className={toggleChipClass(active)}
          >
            #{tagLabel(item)}
          </Link>
        );
      })}
    </div>
  );
}
