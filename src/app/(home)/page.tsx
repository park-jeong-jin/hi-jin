import { PostCard } from "@/components/posts/PostCard";
import { PostFilters } from "@/components/posts/PostFilters";
import { filterPosts, getAvailableTags } from "@/lib/posts";
import { SITE_DESCRIPTION, SITE_NAME } from "@/lib/site";
import { isTag } from "@/lib/taxonomy";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { absolute: SITE_NAME },
  description: SITE_DESCRIPTION,
  alternates: { canonical: "/" },
};

type PageProps = {
  searchParams: Promise<{ tag?: string }>;
};

export default async function HomePage({ searchParams }: PageProps) {
  const params = await searchParams;
  const tag = params.tag && isTag(params.tag) ? params.tag : undefined;

  const posts = filterPosts({ tag });
  const availableTags = getAvailableTags();

  return (
    <div>
      <h1 className="text-3xl tracking-tight text-foreground sm:text-4xl">최신글</h1>

      <div className="mt-8">
        <PostFilters tag={tag} availableTags={availableTags} />
      </div>

      <div>
        {posts.length > 0 ? (
          posts.map((post) => <PostCard key={post.slug} post={post} />)
        ) : (
          <p className="py-8 text-sm text-muted">조건에 맞는 글이 없습니다.</p>
        )}
      </div>
    </div>
  );
}
