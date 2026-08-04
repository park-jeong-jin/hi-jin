export type Heading = {
  depth: 2 | 3;
  text: string;
  id: string;
};

/** rehype 트리 노드 — 이 파일에서 쓰는 최소 형태만 타이핑 */
type HastNode = {
  type: string;
  tagName?: string;
  properties?: Record<string, unknown>;
  children?: HastNode[];
  value?: string;
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

/** hast 노드 → 플레인 텍스트 */
function hastText(node: HastNode): string {
  if (node.type === "text") return node.value ?? "";
  return (node.children ?? []).map(hastText).join("");
}

/** PostToc용 — h2만 남김 */
export function buildTocHeadings(headings: Heading[]): Heading[] {
  return headings.filter((heading) => heading.depth === 2);
}

/**
 * rehype 플러그인 — 실제 MDX 컴파일 트리에서 h2/h3에 id를 부여하고 `collected`에 수집.
 * TOC(목차)와 본문 렌더링이 같은 트리·같은 순회에서 나온 id를 공유하므로
 * (예전처럼 원문 regex 추출과 렌더 시점 매칭이 서로 어긋날 일이 없음).
 */
export function rehypeCollectHeadings(collected: Heading[]) {
  return (tree: HastNode) => {
    const counts = new Map<string, number>();

    function visit(node: HastNode) {
      if (node.type === "element" && (node.tagName === "h2" || node.tagName === "h3")) {
        const depth = node.tagName === "h2" ? 2 : 3;
        const text = hastText(node).trim();
        if (text) {
          const id = nextUniqueId(slugify(text), counts);
          node.properties = { ...node.properties, id };
          collected.push({ depth, text, id });
        }
      }
      (node.children ?? []).forEach(visit);
    }

    visit(tree);
  };
}
