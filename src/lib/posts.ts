import matter from "gray-matter";
import fs from "node:fs";
import path from "node:path";
import { isTag, TAGS } from "@/lib/taxonomy";
import type { Tag } from "@/lib/taxonomy";

export type PostMeta = {
  slug: string;
  title: string;
  description: string;
  date: string;
  tags: Tag[];
};

export type Post = PostMeta & {
  content: string;
};

const postsDirectory = path.join(process.cwd(), "content/posts");

/** post slug 예약어 — app 정적 라우트와 충돌 방지 */
export const RESERVED_SLUGS = new Set(["about"]);

/** 서버 프로세스 생애주기 동안 재사용 — 개발 모드는 수정 즉시 반영되도록 건너뜀 */
let cachedPosts: Post[] | null = null;

export function postHref(slug: string) {
  return `/${slug}`;
}

function assertString(value: unknown, field: string, slug: string): string {
  if (typeof value !== "string" || !value.trim()) {
    throw new Error(`Post "${slug}" missing frontmatter: ${field}`);
  }
  return value.trim();
}

function parseTags(value: unknown, slug: string): Tag[] {
  if (!Array.isArray(value)) return [];

  return value.map((item) => {
    if (typeof item !== "string" || !isTag(item)) {
      throw new Error(
        `Post "${slug}" has invalid tag "${String(item)}". Use: ${TAGS.join(", ")}`,
      );
    }
    return item;
  });
}

function readPostSlugsFromDisk(): string[] {
  if (!fs.existsSync(postsDirectory)) return [];

  const slugs = fs
    .readdirSync(postsDirectory)
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => file.replace(/\.mdx$/, ""));

  for (const slug of slugs) {
    if (RESERVED_SLUGS.has(slug)) {
      throw new Error(
        `Post slug "${slug}" is reserved (conflicts with /${slug}). Rename the file.`,
      );
    }
  }

  return slugs;
}

function readPostFromDisk(slug: string): Post {
  const fullPath = path.join(postsDirectory, `${slug}.mdx`);
  const raw = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(raw);

  return {
    slug,
    title: assertString(data.title, "title", slug),
    description: assertString(data.description, "description", slug),
    date: assertString(data.date, "date", slug),
    tags: parseTags(data.tags, slug),
    content,
  };
}

/** 글 전체를 한 번만 읽어 캐싱 — 이후 호출은 디스크를 다시 안 읽음 */
function loadAllPosts(): Post[] {
  if (cachedPosts && process.env.NODE_ENV !== "development") return cachedPosts;

  const posts = readPostSlugsFromDisk()
    .map((slug) => readPostFromDisk(slug))
    .sort((a, b) => (a.date < b.date ? 1 : -1));

  cachedPosts = posts;
  return posts;
}

export function getPostSlugs(): string[] {
  return loadAllPosts().map((post) => post.slug);
}

export function getPostBySlug(slug: string): Post {
  const post = loadAllPosts().find((p) => p.slug === slug);
  if (!post) {
    throw new Error(`Post not found: ${slug}`);
  }
  return post;
}

export function getAllPosts(): PostMeta[] {
  return loadAllPosts().map(({ content: _, ...meta }) => meta);
}

export function filterPosts(filters: { tag?: Tag } = {}): PostMeta[] {
  return getAllPosts().filter((post) => {
    if (filters.tag && !post.tags.includes(filters.tag)) return false;
    return true;
  });
}

/** 글에 실제 사용된 TAGS만 */
export function getAvailableTags(): Tag[] {
  const used = new Set<Tag>();
  for (const post of getAllPosts()) {
    for (const tag of post.tags) used.add(tag);
  }
  return TAGS.filter((tag) => used.has(tag));
}
