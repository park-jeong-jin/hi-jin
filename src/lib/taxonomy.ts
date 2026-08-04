export type Tag = (typeof TAGS)[number];

/** frontmatter tags 허용 목록 */
export const TAGS = ["react", "nextjs", "typescript", "javascript", "mdx"] as const;

/** UI·URL slug는 소문자, 화면 표기는 공식 브랜드명 */
const TAG_LABELS: Record<Tag, string> = {
  react: "React",
  nextjs: "Next.js",
  typescript: "TypeScript",
  javascript: "JavaScript",
  mdx: "MDX",
};

export function isTag(value: string): value is Tag {
  return (TAGS as readonly string[]).includes(value);
}

export function tagLabel(tag: Tag): string {
  return TAG_LABELS[tag];
}

export function homeHref({ tag }: { tag?: Tag } = {}): string {
  if (!tag) return "/";
  return `/?tag=${encodeURIComponent(tag)}`;
}
