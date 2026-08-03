export type Heading = {
  depth: 2 | 3;
  text: string;
  id: string;
};

/** 제목 텍스트 → `#앵커` id (한글·숫자 유지, 공백은 `-`) */
export function slugify(text: string): string {
  const base = text
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s-]/gu, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

  return base || "section";
}

/** 같은 slug 재등장 시 `-1`, `-2` … suffix (첫 번째는 suffix 없음) */
function nextUniqueId(base: string, counts: Map<string, number>): string {
  const seen = counts.get(base) ?? 0;
  counts.set(base, seen + 1);
  return seen === 0 ? base : `${base}-${seen}`;
}

/** MDX 제목 줄에서 인라인 마크다운만 제거 */
function plainHeadingText(line: string): string {
  return line
    .replace(/\*\*(.+?)\*\*/g, "$1")
    .replace(/_(.+?)_/g, "$1")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\[(.+?)\]\([^)]+\)/g, "$1")
    .trim();
}

/** MDX 원문에서 `##` / `###` 줄만 파싱 — 코드 블록 안 제목은 제외
 *
 * TODO: 인용·리스트 안 heading, 제목 JSX 등으로 id 어긋남이 반복되면
 * remark/mdast(+ MDX 파서)로 교체 검토. 지금은 기준 regex로 충분.
 */
export function extractHeadings(source: string): Heading[] {
  const withoutCode = source.replace(/```[\s\S]*?```/g, "");
  const raw: { depth: 2 | 3; text: string }[] = [];

  for (const line of withoutCode.split("\n")) {
    const match = /^(#{2,3})\s+(.+)$/.exec(line.trim());
    if (!match) continue;

    const depth = match[1].length;
    if (depth !== 2 && depth !== 3) continue;

    const text = plainHeadingText(match[2]);
    if (!text) continue;
    raw.push({ depth, text });
  }

  return assignHeadingIds(raw);
}

/** PostToc용 — h2만 남김 */
export function buildTocHeadings(headings: Heading[]): Heading[] {
  return headings.filter((heading) => heading.depth === 2);
}

/** 같은 slug가 있으면 suffix — 목차 링크와 본문 id 순서 맞춤 */
export function assignHeadingIds(headings: { depth: 2 | 3; text: string }[]): Heading[] {
  const counts = new Map<string, number>();

  return headings.map(({ depth, text }) => ({
    depth,
    text,
    id: nextUniqueId(slugify(text), counts),
  }));
}

/** MDX 렌더 시 h2/h3 id 부여 — extractHeadings와 동일 규칙 */
export function createHeadingIdTracker() {
  const counts = new Map<string, number>();

  return (text: string) => nextUniqueId(slugify(text), counts);
}

/** React children → id용 plain text (MdxHeading에서 사용) */
export function flattenHeadingText(value: unknown): string {
  if (typeof value === "string" || typeof value === "number") {
    return String(value);
  }
  if (Array.isArray(value)) {
    return value.map(flattenHeadingText).join("");
  }
  if (value && typeof value === "object" && "props" in value) {
    const props = (value as { props?: { children?: unknown } }).props;
    return flattenHeadingText(props?.children);
  }
  return "";
}
