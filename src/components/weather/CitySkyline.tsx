"use client";

import { useMemo } from "react";
import { particleRand, WEATHER } from "@/lib/weather";
import { useWeather } from "./WeatherProvider";

type Building = {
  x: number;
  w: number;
  h: number;
};

type WindowCell = {
  key: string;
  x: number;
  y: number;
  lit: boolean;
};

const VIEW_H = 100;
const ROAD_H = 10;
/** 스크롤 타일 목표 폭 (뷰포트 무관) */
const TILE_TARGET = 1400;
const GROUP_COUNT = 8;

/** 건물 그룹 8개, 그룹당 3–5채 */
function buildingsForTile(): { buildings: Building[]; tileWidth: number } {
  const buildingGap = 3.5;
  const groupGap = 56;
  const list: Building[] = [];
  let x = 10;
  let i = 0;

  for (let g = 0; g < GROUP_COUNT; g++) {
    const count = 3 + Math.floor(particleRand(i, 0) * 3); // 3–5
    for (let j = 0; j < count; j++) {
      const w = 28 + Math.round(particleRand(i, 1) * 26); // 28–54
      const h = 42 + Math.round(particleRand(i, 2) * 36); // 42–78
      list.push({ x, w, h });
      x += w + buildingGap;
      i += 1;
    }
    x += groupGap;
  }

  // 타일 폭 부족 시 패턴 반복
  while (x < TILE_TARGET) {
    const count = 3 + Math.floor(particleRand(i, 0) * 3);
    for (let j = 0; j < count; j++) {
      const w = 28 + Math.round(particleRand(i, 1) * 26);
      const h = 42 + Math.round(particleRand(i, 2) * 36);
      list.push({ x, w, h });
      x += w + buildingGap;
      i += 1;
    }
    x += groupGap;
  }

  return { buildings: list, tileWidth: Math.ceil(x) };
}

function windowsFor(buildings: Building[]): WindowCell[] {
  const cells: WindowCell[] = [];
  const stepX = 5;
  const stepY = 5.5;
  const padX = 4;
  const padY = 5;
  const ground = VIEW_H - ROAD_H;

  buildings.forEach((b, bi) => {
    const top = ground - b.h;
    const cols = Math.max(1, Math.floor((b.w - padX * 2) / stepX));
    const rows = Math.max(1, Math.floor((b.h - padY * 2) / stepY));
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        cells.push({
          key: `${bi}-${r}-${c}`,
          x: b.x + padX + c * stepX,
          y: top + padY + r * stepY,
          lit: particleRand(bi * 97 + r * 13 + c, 3) > 0.62,
        });
      }
    }
  });
  return cells;
}

function SkylineStrip({
  width,
  buildings,
  windows,
  isNight,
  isFog,
}: {
  width: number;
  buildings: Building[];
  windows: WindowCell[];
  isNight: boolean;
  isFog: boolean;
}) {
  const ground = VIEW_H - ROAD_H;

  return (
    <svg
      viewBox={`0 0 ${width} ${VIEW_H}`}
      width={width}
      height="100%"
      preserveAspectRatio="none"
      className="block shrink-0"
      aria-hidden
      focusable="false"
    >
      <g fill="currentColor">
        {buildings.map((b, i) => (
          <rect key={i} x={b.x} y={ground - b.h} width={b.w} height={b.h} />
        ))}
      </g>
      <g>
        {windows.map((w) => {
          const lit = isNight && w.lit;
          // FOG 시 창문 opacity 낮춤
          const opacity = isFog
            ? lit
              ? 0.28
              : 0.12
            : lit
              ? 0.95
              : isNight
                ? 0.55
                : 0.85;
          return (
            <rect
              key={w.key}
              x={w.x}
              y={w.y}
              width={2.4}
              height={2.4}
              rx={0.3}
              fill={
                isNight
                  ? lit
                    ? "#f0c85a"
                    : "rgba(0,0,0,0.35)"
                  : "rgba(255,255,255,0.78)"
              }
              opacity={opacity}
            />
          );
        })}
      </g>
      {/* 도로 */}
      <rect x={0} y={ground} width={width} height={ROAD_H} fill="currentColor" opacity={0.35} />
      <line
        x1={0}
        y1={ground + ROAD_H / 2}
        x2={width}
        y2={ground + ROAD_H / 2}
        stroke="var(--paper)"
        strokeOpacity={0.25}
        strokeWidth={1}
        strokeDasharray="6 8"
      />
    </svg>
  );
}

/** 자동차 SVG — left 35% 고정 */
function CityCar({ isNight, hazard }: { isNight: boolean; hazard: boolean }) {
  return (
    <div className="weather-city-car absolute bottom-0.5 left-[35%] z-2">
      <svg
        viewBox="0 0 78 20"
        className="h-5 w-[6.2rem] text-foreground/85 sm:h-6 sm:w-[7.1rem]"
        aria-hidden
        focusable="false"
      >
        <defs>
          {isNight && (
            <linearGradient id="car-headlight" x1="42" y1="0" x2="76" y2="0" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#fff6c8" stopOpacity="0.85" />
              <stop offset="45%" stopColor="#ffe08a" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#ffe08a" stopOpacity="0" />
            </linearGradient>
          )}
        </defs>

        {/* 차체 */}
        <rect x="8" y="9" width="34" height="7" rx="1.6" fill="currentColor" />
        <path d="M34 9 L30 3 H18 L12 9 Z" fill="currentColor" />
        {/* 창문 */}
        <path
          d="M13.6 8.3 L17.2 4.3 H19.4 L16.4 8.3 Z"
          fill="var(--paper)"
          opacity={isNight ? 0.35 : 0.82}
        />
        <path
          d="M20.6 4.3 H28.8 L32.2 8.3 H23 Z"
          fill="var(--paper)"
          opacity={isNight ? 0.4 : 0.88}
        />
        <circle cx="16" cy="16.5" r="2.5" fill="currentColor" opacity={0.9} />
        <circle cx="34" cy="16.5" r="2.5" fill="currentColor" opacity={0.9} />

        {/* 전조등 */}
        {isNight && (
          <g>
            {/* 빔 외곽 */}
            <path
              d="M42 11.2 C48 9.2 58 6.2 76 4.5 L76 18.5 C58 16.8 48 13.8 42 11.8 Z"
              fill="url(#car-headlight)"
            />
            {/* 빔 내부 */}
            <path
              d="M42 11.35 C49 10.2 58 8.6 72 7.4 L72 15.6 C58 14.4 49 12.8 42 11.65 Z"
              fill="#fff3c4"
              opacity={0.45}
            />
            {/* 램프 */}
            <ellipse cx="42.2" cy="11.5" rx="1.4" ry="1.1" fill="#fff8dc" opacity={0.95} />
          </g>
        )}

        {/* 비상등 */}
        {hazard && (
          <g className="weather-city-hazard">
            <ellipse cx="9.5" cy="11.2" rx="4.2" ry="3.2" fill="#ff9f1a" opacity={0.45} />
            <rect x="7.5" y="9.2" width="3.8" height="3.6" rx="0.7" fill="#ffb020" />
            <rect x="8.1" y="9.7" width="2.6" height="2.6" rx="0.45" fill="#ffe08a" />
          </g>
        )}
      </svg>
    </div>
  );
}

/** 도심 스카이라인 (건물 스크롤 + 자동차) */
export function CitySkyline({ className }: { className?: string }) {
  const { sunProgress, time, theme, precip, kind } = useWeather();
  const isNight = theme === "night" || time === "night" || sunProgress == null;
  const isFog = kind === WEATHER.FOG;
  const hazard = precip !== "none" || isFog;

  const { buildings, tileWidth } = useMemo(() => buildingsForTile(), []);
  const windows = useMemo(() => windowsFor(buildings), [buildings]);

  return (
    <div className={`relative w-full overflow-hidden ${className ?? ""}`}>
      {/* FOG: 차량(35%) 근처만 건물 표시 */}
      <div className={isFog ? "weather-city-fog-reveal" : undefined}>
        <div className="weather-city-scroll flex h-full w-max will-change-transform">
          <SkylineStrip
            width={tileWidth}
            buildings={buildings}
            windows={windows}
            isNight={isNight}
            isFog={isFog}
          />
          <SkylineStrip
            width={tileWidth}
            buildings={buildings}
            windows={windows}
            isNight={isNight}
            isFog={isFog}
          />
        </div>
      </div>

      <CityCar isNight={isNight} hazard={hazard} />
    </div>
  );
}
