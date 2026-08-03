"use client";

import { useEffect, useMemo, useState } from "react";
import { particleRand, WEATHER } from "@/lib/weather";
import { useWeather } from "./WeatherProvider";
import { CloudIcon, LightningIcon, MoonIcon, SunIcon } from "./WeatherSkyIcons";
import type { WeatherKind } from "@/lib/weather";

type CloudSlot = {
  left: number;
  top: number;
  size: number;
  opacity: number;
  delay: number;
  fill: string;
};

type CloudPreset = {
  /** 구름 본체 색상 */
  fills: string[];
  /** 구름 본체가 어두울 때 — CloudIcon 얼굴·눈을 밝은색으로 */
  dark?: boolean;
  /** 번개 표시 */
  lightning?: boolean;
};

const CLOUD_PRESETS: Partial<Record<WeatherKind, CloudPreset>> = {
  [WEATHER.CLOUDY]: { fills: ["#8b959e", "#7a858f", "#9aa4ad"] },
  [WEATHER.RAIN]: { fills: ["#6b757c", "#5a646b", "#727c84"], dark: true },
  [WEATHER.SNOW]: { fills: ["#6b757c", "#5a646b", "#727c84"], dark: true },
  [WEATHER.STORM]: {
    fills: ["#3f4850", "#323940", "#4a545c"],
    dark: true,
    lightning: true,
  },
};

function useWindowWidth() {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const apply = () => setWidth(window.innerWidth);
    apply();
    window.addEventListener("resize", apply);
    return () => window.removeEventListener("resize", apply);
  }, []);

  return width;
}

function cloudSlots(count: number, width: number, fills: string[]): CloudSlot[] {
  return Array.from({ length: count }, (_, i) => {
    const size = 52 + particleRand(i, 13) * 36;
    const wPct = (size / Math.max(width, 1)) * 100;
    const band = 96 / count;
    const left = Math.max(
      0,
      Math.min(2 + i * band + particleRand(i, 21) * band * 0.5, 100 - wPct),
    );

    return {
      left,
      top: 62 + (i % 2) * 8 + particleRand(i, 22) * 28,
      size,
      opacity: 0.68 + particleRand(i, 14) * 0.2,
      delay: particleRand(i, 15) * 1.8,
      fill: fills[i % fills.length],
    };
  });
}

function CloudLayer({ width, preset }: { width: number; preset: CloudPreset }) {
  const count = Math.max(2, Math.round(width / 200));
  const slots = useMemo(
    () => cloudSlots(count, width, preset.fills),
    [count, width, preset.fills],
  );

  return (
    <>
      {preset.lightning &&
        slots.map((slot, i) => {
          const cloudWPct = (slot.size / Math.max(width, 1)) * 100;
          return (
            <LightningIcon
              key={`bolt-${i}`}
              className="weather-lightning absolute z-0 w-9"
              style={{
                left: `${slot.left + cloudWPct * (0.35 + particleRand(i, 33) * 0.3)}%`,
                top: slot.top + slot.size * 0.28,
                height: 72 + particleRand(i, 34) * 40,
                animationDelay: `${particleRand(i, 35) * 2.4}s`,
                animationDuration: `${2.6 + particleRand(i, 36) * 2.2}s`,
              }}
            />
          );
        })}
      {slots.map((slot, i) => (
        <div
          key={i}
          className="weather-cloud-drift absolute z-1"
          style={{
            left: `${slot.left}%`,
            top: slot.top,
            width: slot.size,
            opacity: slot.opacity,
            animationDelay: `${slot.delay}s`,
          }}
        >
          <CloudIcon className="w-full" fill={slot.fill} dark={preset.dark} />
        </div>
      ))}
    </>
  );
}

/** 상단 하늘 장식 */
export function WeatherSky() {
  const width = useWindowWidth();
  const { kind, sunProgress, theme } = useWeather();
  const isNight = sunProgress == null;
  const cloudPreset = CLOUD_PRESETS[kind];
  const CelestialIcon = isNight ? MoonIcon : SunIcon;

  if (width <= 0) return null;

  return (
    <div
      className="absolute inset-x-0 top-0 h-40 overflow-hidden sm:h-48"
      aria-hidden
      data-weather={kind}
      data-theme-scene={theme}
      data-sun-progress={sunProgress ?? "night"}
    >
      {kind === WEATHER.SUNNY && (
        <div className="absolute inset-x-0 top-0 z-0 mx-auto flex h-full max-w-5xl justify-end px-3 pt-14 sm:px-4 sm:pt-16">
          <CelestialIcon className="size-16 shrink-0 drop-shadow-sm sm:size-20" />
        </div>
      )}

      {cloudPreset && (
        <CloudLayer key={`clouds-${kind}-${theme}`} width={width} preset={cloudPreset} />
      )}
    </div>
  );
}
