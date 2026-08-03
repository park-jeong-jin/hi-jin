import type { ReactNode } from "react";

type CalloutProps = {
  title?: string;
  children: ReactNode;
};

export function Callout({ title = "참고", children }: CalloutProps) {
  return (
    <aside className="my-8 rounded-xl border border-line bg-surface/80 px-5 py-4">
      <p className="mb-2 font-mono text-xs tracking-[0.14em] text-accent uppercase">
        {title}
      </p>
      <div className="text-[1.02rem] leading-[1.75] text-foreground/90 [&_p]:m-0 [&_strong]:font-semibold [&_strong]:text-foreground">
        {children}
      </div>
    </aside>
  );
}
