"use client";

import { useEffect } from "react";

/** id 요소로 스크롤. 대상 없으면 false */
function scrollToSectionId(id: string): boolean {
  const target = document.getElementById(id);
  if (!target) return false;

  target.scrollIntoView({ block: "start", behavior: "auto" });
  return true;
}

/** location.hash를 디코딩해 해당 섹션으로 스크롤 */
function scrollToHash(): boolean {
  const raw = window.location.hash.slice(1);
  if (!raw) return false;
  return scrollToSectionId(decodeURIComponent(raw));
}

/** URL `#섹션`·목차 클릭 시 해당 제목으로 스크롤 (스크롤 컨테이너는 main, 여백은 h2 scroll-mt-4) */
export function HashScroll() {
  useEffect(() => {
    if ("scrollRestoration" in history) {
      history.scrollRestoration = "manual";
    }

    let retry: number | undefined;
    if (window.location.hash) {
      scrollToHash();
      // # URL 진입: mount 직후 DOM 미준비·Next 스크롤 복원(맨 위) 후 재맞춤
      retry = window.setTimeout(scrollToHash, 100);
    }

    // article 안 # 앵커 클릭 위임 (현재는 목차, 본문 hash 링크도 동일 처리)
    function onAnchorClick(event: MouseEvent) {
      const link = (event.target as Element).closest('a[href^="#"]');
      if (!(link instanceof HTMLAnchorElement)) return;

      const hash = link.getAttribute("href");
      if (!hash || hash === "#") return;

      const id = decodeURIComponent(hash.slice(1));
      if (!document.getElementById(id)) return;

      event.preventDefault();
      history.pushState(null, "", hash);
      scrollToSectionId(id);
    }

    const article = document.querySelector("article");
    article?.addEventListener("click", onAnchorClick);

    return () => {
      if (retry !== undefined) window.clearTimeout(retry);
      article?.removeEventListener("click", onAnchorClick);
    };
  }, []);

  return null;
}
