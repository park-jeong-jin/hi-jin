"use client";

import { useEffect, useRef } from "react";
import { GISCUS } from "@/lib/giscus";

type GiscusCommentsProps = {
  pathname: string;
};

export function GiscusComments({ pathname }: GiscusCommentsProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = ref.current;
    if (!container) return;

    container.innerHTML = "";

    const script = document.createElement("script");
    script.src = "https://giscus.app/client.js";
    script.async = true;
    script.crossOrigin = "anonymous";
    script.setAttribute("data-repo", GISCUS.repo);
    script.setAttribute("data-repo-id", GISCUS.repoId);
    script.setAttribute("data-category", GISCUS.category);
    script.setAttribute("data-category-id", GISCUS.categoryId);
    script.setAttribute("data-mapping", "pathname");
    script.setAttribute("data-strict", "0");
    script.setAttribute("data-reactions-enabled", "0");
    script.setAttribute("data-emit-metadata", "0");
    script.setAttribute("data-input-position", "top");
    script.setAttribute("data-theme", "preferred_color_scheme");
    script.setAttribute("data-lang", "ko");

    container.appendChild(script);

    return () => {
      container.innerHTML = "";
    };
  }, [pathname]);

  return (
    <section className="mt-12 border-t border-line pt-8 sm:mt-16" aria-label="댓글">
      <div ref={ref} className="giscus" />
    </section>
  );
}
