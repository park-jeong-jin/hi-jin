"use client";

import { useEffect, useState } from "react";

const IDLE_TIMEOUT_MS = 1500;
const FALLBACK_DELAY_MS = 200;

/** 첫 페인트 후 idle(또는 짧은 timeout)에 true */
export function useIdleReady() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let idleId = 0;
    let timeoutId = 0;

    const show = () => setReady(true);

    if (typeof window.requestIdleCallback === "function") {
      idleId = window.requestIdleCallback(show, { timeout: IDLE_TIMEOUT_MS });
    } else {
      timeoutId = window.setTimeout(show, FALLBACK_DELAY_MS);
    }

    return () => {
      if (idleId && typeof window.cancelIdleCallback === "function") {
        window.cancelIdleCallback(idleId);
      }
      if (timeoutId) window.clearTimeout(timeoutId);
    };
  }, []);

  return ready;
}
