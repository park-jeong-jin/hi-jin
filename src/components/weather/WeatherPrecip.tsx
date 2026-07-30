"use client";

import { useEffect, useMemo, useState } from "react";
import { particleRand } from "@/lib/weather";
import type { CSSProperties } from "react";
import type { Precip } from "@/lib/weather";

/** width → 빗방울 개수 */
function rainCountFor(width: number) {
  return Math.max(14, Math.round(width / 36));
}

/** width → 눈송이 개수 */
function snowCountFor(width: number) {
  return Math.max(12, Math.round(width / 44));
}

/** 빗방울 — particleRand로 위치·속도 고정 */
function RainDrops({ count }: { count: number }) {
  const drops = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => {
        const duration = 0.55 + particleRand(i, 1) * 1.05;
        const delay = -(particleRand(i, 2) * duration);
        return {
          left: 2 + particleRand(i, 3) * 96,
          duration,
          delay,
          height: 8 + particleRand(i, 4) * 14,
          opacity: 0.35 + particleRand(i, 5) * 0.5,
          drift: -8 + particleRand(i, 6) * 16,
        };
      }),
    [count],
  );

  return (
    <>
      {drops.map((drop, i) => (
        <span
          key={i}
          className="weather-raindrop absolute w-px rounded-full"
          style={
            {
              left: `${drop.left}%`,
              height: drop.height,
              opacity: drop.opacity,
              "--rain-drift": `${drop.drift}px`,
              animationDelay: `${drop.delay}s`,
              animationDuration: `${drop.duration}s`,
            } as CSSProperties
          }
        />
      ))}
    </>
  );
}

/** 눈송이 — 비보다 느린 낙하 + sway */
function SnowFlakes({ count }: { count: number }) {
  const flakes = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => {
        const duration = 6 + particleRand(i, 1) * 5;
        const delay = -(particleRand(i, 2) * duration);
        return {
          left: 2 + particleRand(i, 3) * 96,
          duration,
          delay,
          size: 3 + particleRand(i, 4) * 5,
          opacity: 0.4 + particleRand(i, 5) * 0.45,
          sway: 8 + particleRand(i, 6) * 16,
        };
      }),
    [count],
  );

  return (
    <>
      {flakes.map((flake, i) => (
        <span
          key={i}
          className="weather-snowflake absolute rounded-full"
          style={
            {
              left: `${flake.left}%`,
              width: flake.size,
              height: flake.size,
              opacity: flake.opacity,
              "--snow-sway": `${flake.sway}px`,
              animationDelay: `${flake.delay}s`,
              animationDuration: `${flake.duration}s`,
            } as CSSProperties
          }
        />
      ))}
    </>
  );
}

/** 비/눈 오버레이 (FOG는 CitySkyline) */
export function WeatherPrecip({ precip }: { precip: Precip }) {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const apply = () => setWidth(window.innerWidth);
    apply();
    window.addEventListener("resize", apply);
    return () => window.removeEventListener("resize", apply);
  }, []);

  const showRain = precip === "rain";
  const showSnow = precip === "snow";
  const reduceMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (reduceMotion || (!showRain && !showSnow) || width <= 0) return null;

  return (
    <div className="absolute inset-0 z-1 overflow-hidden" aria-hidden>
      {showRain && <RainDrops count={rainCountFor(width)} />}
      {showSnow && <SnowFlakes count={snowCountFor(width)} />}
    </div>
  );
}
