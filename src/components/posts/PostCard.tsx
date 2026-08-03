import Link from "next/link";
import { postHref } from "@/lib/posts";
import { homeHref, tagLabel } from "@/lib/taxonomy";
import { tagChipLinkClass } from "@/lib/ui/tagChip";
import type { PostMeta } from "@/lib/posts";

type PostCardProps = {
  post: PostMeta;
};

export function PostCard({ post }: PostCardProps) {
  return (
    <article className="border-t border-line py-5 first:border-t-0 sm:py-7">
      <Link
        href={postHref(post.slug)}
        className="group block"
      >
        <div className="flex flex-col gap-1 sm:flex-row sm:flex-wrap sm:items-baseline sm:justify-between sm:gap-3">
          <h2 className="text-xl tracking-tight text-foreground transition group-hover:text-accent-ink sm:text-2xl">
            {post.title}
          </h2>
          <time
            dateTime={post.date}
            className="shrink-0 font-mono text-xs tracking-[0.08em] text-muted"
          >
            {post.date}
          </time>
        </div>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink-soft sm:text-base">
          {post.description}
        </p>
      </Link>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        {post.tags.map((tag) => (
          <Link key={tag} href={homeHref({ tag })} className={tagChipLinkClass()}>
            #{tagLabel(tag)}
          </Link>
        ))}
      </div>
    </article>
  );
}
