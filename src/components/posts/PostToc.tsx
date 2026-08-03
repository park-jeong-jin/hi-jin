import type { Heading } from "@/lib/mdx/headings";

type PostTocProps = {
  headings: Heading[];
};

export function PostToc({ headings }: PostTocProps) {
  if (headings.length < 2) return null;

  return (
    <nav
      aria-label="목차"
      className="mt-6 rounded-xl border border-line bg-surface/80 px-4 py-4 sm:px-5"
    >
      <p className="font-mono text-[11px] tracking-[0.12em] text-muted uppercase">목차</p>
      <ol className="mt-3 space-y-1">
        {headings.map((heading) => (
          <li key={heading.id}>
            <a
              href={`#${heading.id}`}
              className="block rounded-md px-2 py-1.5 text-[0.95rem] leading-snug text-ink-soft transition hover:bg-background/60 hover:text-foreground sm:text-base"
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
