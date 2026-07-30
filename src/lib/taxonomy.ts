export type Tag = (typeof TAGS)[number];

/** frontmatter tags 허용 목록 */
export const TAGS = [
  "react",
  "nextjs",
  "typescript",
  "javascript",
  "hooks",
  "mdx",
  "note",
  "daily",
] as const;

export function isTag(value: string): value is Tag {
  return (TAGS as readonly string[]).includes(value);
}

export function homeHref({ tag }: { tag?: Tag } = {}): string {
  if (!tag) return "/";
  return `/?tag=${encodeURIComponent(tag)}`;
}
