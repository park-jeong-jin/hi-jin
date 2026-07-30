import { Callout } from "@/components/mdx/Callout";
import { DemoCounter } from "@/components/mdx/DemoCounter";
import type { ComponentPropsWithoutRef } from "react";
import type { MDXComponents } from "mdx/types";

type PreProps = ComponentPropsWithoutRef<"pre">;
type CodeProps = ComponentPropsWithoutRef<"code">;

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

export const mdxComponents: MDXComponents = {
  Callout,
  DemoCounter,
  pre: Pre,
  code: Code,
  h2: (props) => (
    <h2 className="mt-12 mb-4 text-2xl tracking-tight text-foreground" {...props} />
  ),
  h3: (props) => (
    <h3 className="mt-8 mb-3 text-xl tracking-tight text-foreground" {...props} />
  ),
  p: (props) => (
    <p className="my-5 text-[1.05rem] leading-[1.75] text-ink-soft" {...props} />
  ),
  a: ({ href, children, ...props }) => {
    const external = Boolean(href && /^https?:\/\//i.test(href));
    return (
      <a
        {...props}
        href={href}
        className="text-accent-ink underline decoration-accent/50 underline-offset-4 transition hover:decoration-accent"
        {...(external
          ? { target: "_blank", rel: "noopener noreferrer" }
          : {})}
      >
        {children}
      </a>
    );
  },
  ul: (props) => (
    <ul className="my-5 list-disc space-y-2 pl-6 text-ink-soft" {...props} />
  ),
  ol: (props) => (
    <ol className="my-5 list-decimal space-y-2 pl-6 text-ink-soft" {...props} />
  ),
  blockquote: (props) => (
    <blockquote
      className="my-6 border-l-2 border-accent pl-4 text-ink-soft italic"
      {...props}
    />
  ),
};
