"use client";

import { useEffect, useRef } from "react";
import { useIdleReady } from "@/hooks/useIdleReady";

const MAX_PARTICLES = 24;
const MIN_DISTANCE = 28;
const FALLBACK_CLEANUP_MS = 1200;

/** 커서가 지나간 자리에 남는 똥 이모지 트레일 */
export function CursorTrail() {
  const ready = useIdleReady();
  const containerRef = useRef<HTMLDivElement>(null);
  const lastPos = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    if (!ready) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;

    const container = containerRef.current;
    if (!container) return;

    function onMove(e: PointerEvent) {
      if (e.pointerType !== "mouse" || !container) return;

      const last = lastPos.current;
      if (last) {
        const dx = e.clientX - last.x;
        const dy = e.clientY - last.y;
        if (dx * dx + dy * dy < MIN_DISTANCE * MIN_DISTANCE) return;
      }
      lastPos.current = { x: e.clientX, y: e.clientY };

      if (container.childElementCount >= MAX_PARTICLES) return;
      const dot = document.createElement("span");
      dot.className = "cursor-trail-dot";
      dot.textContent = "💩";
      dot.style.left = `${e.clientX}px`;
      dot.style.top = `${e.clientY}px`;
      container.appendChild(dot);

      const cleanup = () => {
        dot.remove();
      };
      const fallbackId = window.setTimeout(cleanup, FALLBACK_CLEANUP_MS);
      dot.addEventListener(
        "animationend",
        () => {
          window.clearTimeout(fallbackId);
          cleanup();
        },
        { once: true },
      );
    }

    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, [ready]);

  if (!ready) return null;

  return <div ref={containerRef} className="pointer-events-none fixed inset-0 z-30" aria-hidden />;
}
