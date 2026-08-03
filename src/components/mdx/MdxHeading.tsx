"use client";

import type { MouseEvent, ReactNode } from "react";

type MdxHeadingProps = {
  id: string;
  label: string;
  className: string;
  children: ReactNode;
};

export function MdxHeading({ id, label, className, children }: MdxHeadingProps) {
  async function copySectionLink(event: MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    const url = new URL(window.location.href);
    url.hash = id;
    try {
      await navigator.clipboard.writeText(url.toString());
    } catch {
      // clipboard API unavailable — ignore
    }
  }

  return (
    <h2 id={id} className={className}>
      <button
        type="button"
        onClick={copySectionLink}
        aria-label={`${label} 섹션 링크 복사`}
        className="cursor-pointer border-0 bg-transparent p-0 text-left text-inherit transition-colors after:ml-2 after:font-mono after:leading-none after:text-muted after:opacity-0 after:transition after:content-['#'] hover:text-accent-ink hover:after:text-accent-ink hover:after:opacity-100"
      >
        {children}
      </button>
    </h2>
  );
}
