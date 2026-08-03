import { Callout } from "@/components/mdx/Callout";
import { DemoCounter } from "@/components/mdx/DemoCounter";
import { MdxHeading } from "@/components/mdx/MdxHeading";
import { createHeadingIdTracker, flattenHeadingText } from "@/lib/mdx/headings";
import type { ComponentPropsWithoutRef } from "react";
import type { MDXComponents } from "mdx/types";
import type { Heading } from "@/lib/mdx/headings";

type PreProps = ComponentPropsWithoutRef<"pre">;
type CodeProps = ComponentPropsWithoutRef<"code">;
type H2Props = ComponentPropsWithoutRef<"h2">;
type H3Props = ComponentPropsWithoutRef<"h3">;

const bodyClass =
  "text-[1.05rem] leading-[1.8] text-foreground/90 [&_strong]:font-semibold [&_strong]:text-foreground";
const listClass =
  "my-5 space-y-2.5 pl-6 text-[1.05rem] leading-[1.75] text-foreground/90 [&_strong]:font-semibold [&_strong]:text-foreground";

function Pre({ children, className, style, ...props }: PreProps) {
  return (
    <pre
      className={[
        "my-6 overflow-x-auto rounded-xl border border-line p-4 font-mono text-sm leading-relaxed",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      style={style}
      {...props}
    >
      {children}
    </pre>
  );
}

function Code({ children, className, style, ...props }: CodeProps) {
  const isBlock =
    Boolean(style) ||
    Boolean(className?.includes("language-")) ||
    // rehype-pretty-code: 하이라이트는 block <code>
    Object.keys(props).some((key) => key.startsWith("data-"));

  if (isBlock) {
    // Shiki 색상은 자식 span에 있음 — text-* 미적용
    return (
      <code className={className} style={style} {...props}>
        {children}
      </code>
    );
  }

  return (
    <code
      className="rounded bg-code-bg px-1.5 py-0.5 font-mono text-[0.9em] text-foreground"
      {...props}
    >
      {children}
    </code>
  );
}

export function createMdxComponents(syncHeadings: Heading[] = []): MDXComponents {
  let index = 0;
  const fallbackId = createHeadingIdTracker();

  function takeId(text: string): string {
    if (index < syncHeadings.length) {
      return syncHeadings[index++].id;
    }
    return fallbackId(text);
  }

  function H2({ children }: H2Props) {
    const label = flattenHeadingText(children);
    const id = takeId(label);
    return (
      <MdxHeading
        id={id}
        label={label}
        className="mt-14 mb-3 scroll-mt-4 border-t border-line/70 pt-10 text-2xl tracking-tight text-foreground"
      >
        {children}
      </MdxHeading>
    );
  }

  function H3({ children }: H3Props) {
    const label = flattenHeadingText(children);
    const id = takeId(label);
    return (
      <h3
        id={id}
        className="mt-8 mb-2 text-lg font-medium tracking-tight text-foreground"
      >
        {children}
      </h3>
    );
  }

  return {
    Callout,
    DemoCounter,
    pre: Pre,
    code: Code,
    h2: H2,
    h3: H3,
    strong: (props) => (
      <strong className="font-semibold text-foreground" {...props} />
    ),
    p: (props) => <p className={`my-5 ${bodyClass}`} {...props} />,
    a: ({ href, children, ...props }) => {
      const external = Boolean(href && /^https?:\/\//i.test(href));
      return (
        <a
          {...props}
          href={href}
          className="text-accent-ink underline decoration-accent/50 underline-offset-4 transition hover:decoration-accent"
          {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        >
          {children}
        </a>
      );
    },
    ul: (props) => <ul className={`${listClass} list-disc`} {...props} />,
    ol: (props) => <ol className={`${listClass} list-decimal`} {...props} />,
    li: (props) => <li className="pl-0.5" {...props} />,
    blockquote: (props) => (
      <blockquote
        className="my-6 border-l-2 border-accent/60 pl-4 text-foreground/85 italic"
        {...props}
      />
    ),
    table: (props) => (
      <div className="my-6 overflow-x-auto">
        <table className="w-full min-w-[20rem] border-collapse text-sm" {...props} />
      </div>
    ),
    thead: (props) => <thead className="border-b border-line" {...props} />,
    th: (props) => (
      <th
        className="px-3 py-2 text-left text-[0.95rem] font-medium text-foreground"
        {...props}
      />
    ),
    td: (props) => (
      <td className="border-t border-line px-3 py-2 align-top text-foreground/85" {...props} />
    ),
  };
}

/** 글 페이지 — createMdxComponents()로 id가 붙은 h2/h3 사용 */
export const mdxComponents: MDXComponents = createMdxComponents();
