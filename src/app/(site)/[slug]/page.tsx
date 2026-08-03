import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { ArrowLeft } from "lucide-react";
import rehypePrettyCode from "rehype-pretty-code";
import remarkGfm from "remark-gfm";
import { createMdxComponents } from "@/components/mdx/components";
import { HashScroll } from "@/components/posts/HashScroll";
import { PostToc } from "@/components/posts/PostToc";
import { buildTocHeadings, extractHeadings } from "@/lib/mdx/headings";
import { getAllPosts, getPostBySlug, getPostSlugs, postHref } from "@/lib/posts";
import { homeHref, tagLabel } from "@/lib/taxonomy";
import { tagChipLinkClass } from "@/lib/ui/tagChip";
import type { Metadata } from "next";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getPostSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  try {
    const post = getPostBySlug(slug);
    const url = postHref(slug);
    return {
      title: post.title,
      description: post.description,
      alternates: { canonical: url },
      openGraph: {
        type: "article",
        title: post.title,
        description: post.description,
        url,
        publishedTime: post.date,
      },
    };
  } catch {
    return {};
  }
}

export default async function PostPage({ params }: PageProps) {
  const { slug } = await params;
  let post;
  try {
    post = getPostBySlug(slug);
  } catch {
    notFound();
  }

  const posts = getAllPosts();
  const index = posts.findIndex((p) => p.slug === slug);
  const prev = posts[index + 1];
  const next = posts[index - 1];
  const headings = extractHeadings(post.content);
  const tocHeadings = buildTocHeadings(headings);
  const components = createMdxComponents(headings);

  return (
    <article>
      <HashScroll />
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 font-mono text-[11px] tracking-[0.12em] text-muted uppercase transition hover:text-foreground sm:text-xs"
      >
        <ArrowLeft className="size-3.5" aria-hidden />글
      </Link>

      <header className="mt-5 border-b border-line pb-6 sm:mt-6 sm:pb-8">
        <p className="font-mono text-[11px] tracking-widest text-muted sm:text-xs">
          <time dateTime={post.date}>{post.date}</time>
        </p>
        <h1 className="mt-3 text-[clamp(1.75rem,6vw,3rem)] leading-tight tracking-tight text-foreground">
          {post.title}
        </h1>
        <p className="mt-3 text-base text-ink-soft sm:mt-4 sm:text-lg">
          {post.description}
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <Link key={tag} href={homeHref({ tag })} className={tagChipLinkClass()}>
              #{tagLabel(tag)}
            </Link>
          ))}
        </div>
      </header>

      <PostToc headings={tocHeadings} />

      <div className="mdx-content pt-2 wrap-break-word">
        <MDXRemote
          source={post.content}
          components={components}
          options={{
            mdxOptions: {
              remarkPlugins: [remarkGfm],
              rehypePlugins: [
                [
                  rehypePrettyCode,
                  {
                    theme: "github-dark",
                    keepBackground: true,
                  },
                ],
              ],
            },
          }}
        />
      </div>

      <nav className="mt-12 grid gap-6 border-t border-line pt-8 sm:mt-16 sm:grid-cols-2 sm:gap-4">
        {prev ? (
          <Link href={postHref(prev.slug)} className="group block">
            <p className="font-mono text-[11px] tracking-[0.12em] text-muted uppercase">
              이전 글
            </p>
            <p className="mt-1 text-foreground transition group-hover:text-accent-ink">
              {prev.title}
            </p>
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link href={postHref(next.slug)} className="group block sm:text-right">
            <p className="font-mono text-[11px] tracking-[0.12em] text-muted uppercase">
              다음 글
            </p>
            <p className="mt-1 text-foreground transition group-hover:text-accent-ink">
              {next.title}
            </p>
          </Link>
        ) : null}
      </nav>
    </article>
  );
}
