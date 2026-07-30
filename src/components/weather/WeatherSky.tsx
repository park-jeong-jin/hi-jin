"use client";

import { useEffect, useId, useMemo, useState } from "react";
import { particleRand, WEATHER } from "@/lib/weather";
import { useWeather } from "./WeatherProvider";
import type { WeatherKind } from "@/lib/weather";

type CloudSlot = {
  left: number;
  top: number;
  size: number;
  opacity: number;
  delay: number;
  fill: string;
};

/** 리사이즈 시 너비 스냅 (160px 단위) */
const WIDTH_STEP = 160;

function snapWidth(width: number) {
  return Math.max(WIDTH_STEP, Math.round(width / WIDTH_STEP) * WIDTH_STEP);
}

function useWindowWidth() {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const apply = () => {
      const next = snapWidth(window.innerWidth);
      setWidth((prev) => (prev === next ? prev : next));
    };
    apply();
    window.addEventListener("resize", apply);
    return () => window.removeEventListener("resize", apply);
  }, []);

  return width;
}

/** width → 구름 개수 */
function cloudCountFor(width: number) {
  return Math.max(2, Math.round(width / 200));
}

/** overcast 배경 대비 구름색 */
const OVERCAST_CLOUD_FILLS = ["#8b959e", "#7a858f", "#9aa4ad"];

function cloudSlotsFor(count: number, sceneWidth: number, fills?: string[]): CloudSlot[] {
  const slots: CloudSlot[] = [];
  const usable = 96;
  // 헤더 아래 ~ 본문 패널 위 하늘 영역
  const bandTop = 62;
  const bandSpan = 28;

  for (let i = 0; i < count; i++) {
    const size = 52 + particleRand(i, 13) * 36;
    const wPct = (size / Math.max(sceneWidth, 1)) * 100;
    const band = usable / count;
    const bandStart = 2 + i * band;
    const jitter = (particleRand(i, 21) - 0.5) * band * 0.7;
    const left = Math.max(0, Math.min(bandStart + band * 0.15 + jitter, 100 - wPct));
    const rowBias = i % 2 === 0 ? 0 : 8;
    const top = bandTop + rowBias + particleRand(i, 22) * bandSpan;

    slots.push({
      left,
      top,
      size,
      opacity: 0.68 + particleRand(i, 14) * 0.2,
      delay: particleRand(i, 15) * 1.8,
      fill: fills?.[i % (fills.length || 1)] ?? "#cfd3d6",
    });
  }

  return slots;
}

function SunSvg({ className }: { className?: string }) {
  const uid = useId();
  const rays = Array.from({ length: 8 }, (_, i) => i);

  return (
    <svg viewBox="0 0 120 120" className={className} aria-hidden focusable="false">
      <g className="weather-sun-rays">
        {rays.map((i) => (
          <polygon
            key={i}
            points="60,8 72,38 48,38"
            fill="#f0a05a"
            transform={`rotate(${i * 45} 60 60)`}
          />
        ))}
      </g>
      <clipPath id={`${uid}-face`}>
        <circle cx="60" cy="60" r="32" />
      </clipPath>
      <g clipPath={`url(#${uid}-face)`}>
        <rect x="28" y="28" width="32" height="64" fill="#ffe566" />
        <rect x="60" y="28" width="32" height="64" fill="#f5c842" />
      </g>
      <circle cx="50" cy="56" r="3.2" fill="#8a4a1a" />
      <circle cx="70" cy="56" r="3.2" fill="#8a4a1a" />
      <path
        d="M48 68 Q60 80 72 68"
        fill="none"
        stroke="#8a4a1a"
        strokeWidth="3.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

/** 보름달 SVG */
function MoonSvg({ className }: { className?: string }) {
  const uid = useId();

  return (
    <svg viewBox="0 0 120 120" className={className} aria-hidden focusable="false">
      <circle cx="60" cy="60" r="38" fill="#f4e8c0" opacity="0.22" />
      <clipPath id={`${uid}-moon`}>
        <circle cx="60" cy="60" r="30" />
      </clipPath>
      <g clipPath={`url(#${uid}-moon)`}>
        <rect x="30" y="30" width="30" height="60" fill="#f7efd2" />
        <rect x="60" y="30" width="30" height="60" fill="#ebe0b8" />
        <circle cx="44" cy="48" r="5" fill="#d9cfa0" opacity="0.55" />
        <circle cx="72" cy="70" r="7" fill="#d9cfa0" opacity="0.45" />
        <circle cx="58" cy="78" r="3.5" fill="#d9cfa0" opacity="0.4" />
      </g>
      <path
        d="M44 56 Q50 60 56 56"
        fill="none"
        stroke="#7a6540"
        strokeWidth="2.6"
        strokeLinecap="round"
      />
      <path
        d="M64 56 Q70 60 76 56"
        fill="none"
        stroke="#7a6540"
        strokeWidth="2.6"
        strokeLinecap="round"
      />
      <path
        d="M52 70 Q60 74 68 70"
        fill="none"
        stroke="#7a6540"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

function hexLuma(hex: string): number {
  const raw = hex.replace("#", "");
  const full =
    raw.length === 3
      ? raw
          .split("")
          .map((c) => c + c)
          .join("")
      : raw;
  if (full.length !== 6) return 0.7;
  const r = parseInt(full.slice(0, 2), 16);
  const g = parseInt(full.slice(2, 4), 16);
  const b = parseInt(full.slice(4, 6), 16);
  return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
}

/** 구름 밝기에 따른 얼굴색 */
function faceColorFor(fill: string): string {
  return hexLuma(fill) < 0.48 ? "#efe8df" : "#5c3a28";
}

/** 구름 SVG — fill로 색상 지정 */
function CloudSvg({
  className,
  fill = "#cfd3d6",
}: {
  className?: string;
  fill?: string;
}) {
  const face = faceColorFor(fill);
  const darkBody = hexLuma(fill) < 0.48;
  const eyeR = darkBody ? 2.2 : 1.8;
  const strokeW = darkBody ? 1.9 : 1.5;

  return (
    <svg viewBox="0 0 160 72" className={className} aria-hidden focusable="false">
      <ellipse cx="48" cy="40" rx="36" ry="24" fill={fill} />
      <ellipse cx="112" cy="40" rx="36" ry="24" fill={fill} />
      <ellipse cx="80" cy="34" rx="40" ry="26" fill={fill} />
      <ellipse cx="80" cy="48" rx="52" ry="18" fill={fill} />
      <circle cx="72" cy="40" r={eyeR} fill={face} />
      <circle cx="88" cy="40" r={eyeR} fill={face} />
      <path
        d="M76 47 Q80 50 84 47"
        fill="none"
        stroke={face}
        strokeWidth={strokeW}
        strokeLinecap="round"
      />
    </svg>
  );
}

function LightningBolt({
  left,
  top,
  delay,
  duration,
  height,
}: {
  left: string;
  top: number;
  delay: string;
  duration: string;
  height: number;
}) {
  return (
    <svg
      viewBox="0 0 40 100"
      className="weather-lightning pointer-events-none absolute z-0 w-9"
      style={{
        left,
        top,
        height,
        animationDelay: delay,
        animationDuration: duration,
      }}
      aria-hidden
      focusable="false"
    >
      <polygon points="22,0 6,42 18,42 10,100 34,38 20,38" fill="#f7e27a" />
    </svg>
  );
}

function CloudLayer({
  count,
  width,
  fills,
  withLightning = false,
}: {
  count: number;
  width: number;
  fills?: string[];
  withLightning?: boolean;
}) {
  const fillKey = fills?.join("|") ?? "";
  const slots = useMemo(
    () => cloudSlotsFor(count, width, fillKey ? fillKey.split("|") : undefined),
    [count, width, fillKey],
  );

  return (
    <>
      {withLightning &&
        slots.map((slot, i) => {
          const cloudWPct = (slot.size / Math.max(width, 1)) * 100;
          const boltLeft = slot.left + cloudWPct * (0.35 + particleRand(i, 33) * 0.3);
          const boltTop = slot.top + slot.size * 0.28;
          const boltH = 72 + particleRand(i, 34) * 40;

          return (
            <LightningBolt
              key={`bolt-${i}`}
              left={`${boltLeft}%`}
              top={boltTop}
              height={boltH}
              delay={`${particleRand(i, 35) * 2.4}s`}
              duration={`${2.6 + particleRand(i, 36) * 2.2}s`}
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
          <CloudSvg className="w-full" fill={slot.fill} />
        </div>
      ))}
    </>
  );
}

/** 하늘 장식 (해·달·구름·번개) */
function WeatherScene({
  kind,
  width,
  sunProgress,
}: {
  kind: WeatherKind;
  width: number;
  sunProgress: number | null;
}) {
  const clouds = cloudCountFor(width);
  const isNight = sunProgress == null;

  switch (kind) {
    case WEATHER.SUNNY:
      return (
        <div className="absolute top-14 right-2 z-1 size-16 sm:top-16 sm:right-4 sm:size-20">
          {isNight ? (
            <MoonSvg className="size-full drop-shadow-sm" />
          ) : (
            <SunSvg className="size-full drop-shadow-sm" />
          )}
        </div>
      );
    case WEATHER.CLOUDY:
      return (
        <>
          {isNight && (
            <div className="absolute top-14 right-3 z-0 size-14 opacity-70 sm:top-16 sm:right-5 sm:size-16">
              <MoonSvg className="size-full" />
            </div>
          )}
          <CloudLayer count={clouds} width={width} fills={OVERCAST_CLOUD_FILLS} />
        </>
      );
    case WEATHER.FOG:
      // FOG는 CitySkyline에서 처리
      return null;
    case WEATHER.RAIN:
      return (
        <CloudLayer
          count={clouds}
          width={width}
          fills={["#6b757c", "#5a646b", "#727c84"]}
        />
      );
    case WEATHER.SNOW:
      return (
        <CloudLayer count={clouds} width={width} fills={OVERCAST_CLOUD_FILLS} />
      );
    case WEATHER.STORM:
      return (
        <CloudLayer
          count={clouds}
          width={width}
          fills={["#3f4850", "#323940", "#4a545c"]}
          withLightning
        />
      );
  }
}

/** 상단 하늘 장식 */
export function WeatherSky() {
  const width = useWindowWidth();
  const { kind, sunProgress, theme } = useWeather();

  if (width <= 0) return null;

  return (
    <div
      className="absolute inset-x-0 top-0 h-40 overflow-hidden sm:h-48"
      aria-hidden
      data-weather={kind}
      data-theme-scene={theme}
      data-sun-progress={sunProgress ?? "night"}
    >
      <WeatherScene
        key={`${kind}-${String(sunProgress)}-${theme}`}
        kind={kind}
        width={width}
        sunProgress={sunProgress}
      />
    </div>
  );
}

