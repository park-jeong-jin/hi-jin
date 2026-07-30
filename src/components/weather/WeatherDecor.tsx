"use client";

import { useIdleReady } from "@/hooks/useIdleReady";
import { CitySkyline } from "./CitySkyline";
import { WeatherPrecip } from "./WeatherPrecip";
import { WeatherSky } from "./WeatherSky";
import type { Precip } from "@/lib/weather";

/** 하늘·도시·강수 장식 — idle 후 마운트 */
export function WeatherDecor({ precip }: { precip: Precip }) {
  const ready = useIdleReady();
  if (!ready) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-1" aria-hidden>
      <WeatherSky />
      <div className="weather-city-bg absolute inset-x-0 bottom-0 overflow-hidden text-foreground/16">
        <CitySkyline className="h-19 sm:h-22" />
      </div>
      <WeatherPrecip precip={precip} />
    </div>
  );
}
