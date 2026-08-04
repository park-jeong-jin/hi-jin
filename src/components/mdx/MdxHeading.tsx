"use client";

import { useId } from "react";
import type { MouseEvent, ReactNode } from "react";

type MdxHeadingProps = {
  id: string;
  className: string;
  children: ReactNode;
};

export function MdxHeading({ id, className, children }: MdxHeadingProps) {
  const descriptionId = useId();

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
    <>
      <h2 id={id} className={className}>
        <button
          type="button"
          onClick={copySectionLink}
          aria-describedby={descriptionId}
          className="cursor-pointer border-0 bg-transparent p-0 text-left text-inherit transition-colors after:ml-2 after:font-mono after:leading-none after:text-muted after:opacity-0 after:transition after:content-['#'] hover:text-accent-ink hover:after:text-accent-ink hover:after:opacity-100 focus-visible:text-accent-ink focus-visible:after:text-accent-ink focus-visible:after:opacity-100"
        >
          {children}
        </button>
      </h2>
      {/* h2 밖에 둬야 함 — h2 안에 있으면 accessible name 계산에 다시 섞여 들어감 */}
      <span id={descriptionId} className="sr-only">
        섹션 링크 복사
      </span>
    </>
  );
}
