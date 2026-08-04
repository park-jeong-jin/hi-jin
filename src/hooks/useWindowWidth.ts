"use client";

import { useEffect, useState } from "react";

/** window.innerWidth — resize에 반응, SSR 시 0 */
export function useWindowWidth() {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const apply = () => setWidth(window.innerWidth);
    apply();
    window.addEventListener("resize", apply);
    return () => window.removeEventListener("resize", apply);
  }, []);

  return width;
}
