import type { ReactNode } from "react";

type CalloutProps = {
  title?: string;
  children: ReactNode;
};

export function Callout({ title = "참고", children }: CalloutProps) {
  return (
    <aside className="my-8 border-l-2 border-accent bg-surface px-5 py-4">
      <p className="mb-2 font-mono text-xs tracking-[0.14em] text-accent uppercase">
        {title}
      </p>
      <div className="text-[0.95rem] leading-relaxed text-ink-soft [&_p]:m-0">
        {children}
      </div>
    </aside>
  );
}
