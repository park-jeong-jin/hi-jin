"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Settings } from "lucide-react";
import { WEATHER } from "@/lib/weather";
import { useWeather } from "./WeatherProvider";
import type { WeatherKind } from "@/lib/weather";

const TIMES: { id: boolean; label: string }[] = [
  { id: true, label: "낮" },
  { id: false, label: "밤" },
];

const WEATHERS: { id: WeatherKind; label: string }[] = [
  { id: WEATHER.SUNNY, label: "맑음" },
  { id: WEATHER.CLOUDY, label: "흐림" },
  { id: WEATHER.RAIN, label: "비" },
  { id: WEATHER.SNOW, label: "눈" },
  { id: WEATHER.FOG, label: "안개" },
  { id: WEATHER.STORM, label: "폭풍" },
];

function chipClass(active: boolean) {
  return `rounded-md px-2 py-1 font-mono text-[10px] tracking-[0.08em] transition sm:text-[11px] ${
    active
      ? "bg-foreground text-background"
      : "bg-surface/80 text-muted hover:bg-surface hover:text-foreground"
  }`;
}

/** 헤더 테마 메뉴 (시간·날씨) */
export function ThemeMenu() {
  const { mode, isDay, kind, setAuto, setManual } = useWeather();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const menuId = useId();

  useEffect(() => {
    if (!open) return;

    const onPointer = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };

    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);

    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        aria-label="테마 설정"
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => setOpen((v) => !v)}
        className={`flex size-8 items-center justify-center rounded-md transition ${
          open
            ? "bg-surface text-foreground"
            : mode === "manual"
              ? "text-foreground hover:bg-surface/70"
              : "text-muted hover:bg-surface/70 hover:text-foreground"
        }`}
      >
        <Settings className="size-4" strokeWidth={1.75} aria-hidden />
      </button>

      {open && (
        <div
          id={menuId}
          role="dialog"
          aria-label="시간·날씨 테마"
          className="absolute top-full right-0 z-50 mt-2 w-56 rounded-xl border border-line bg-background p-3 shadow-lg"
          onPointerDown={(e) => e.stopPropagation()}
        >
          <div className="mb-3 flex items-center justify-between gap-2">
            <span className="font-mono text-[10px] tracking-[0.12em] text-muted uppercase">
              테마
            </span>
            <button
              type="button"
              onClick={() => {
                setAuto();
              }}
              className={chipClass(mode === "auto")}
            >
              자동
            </button>
          </div>

          <p className="mb-1.5 font-mono text-[10px] tracking-widest text-muted uppercase">
            시간
          </p>
          <div className="mb-3 flex flex-wrap gap-1">
            {TIMES.map((item) => (
              <button
                key={String(item.id)}
                type="button"
                onClick={() => setManual({ isDay: item.id })}
                className={chipClass(isDay === item.id)}
              >
                {item.label}
              </button>
            ))}
          </div>

          <p className="mb-1.5 font-mono text-[10px] tracking-widest text-muted uppercase">
            날씨
          </p>
          <div className="flex flex-wrap gap-1">
            {WEATHERS.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setManual({ weather: item.id })}
                className={chipClass(kind === item.id)}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
