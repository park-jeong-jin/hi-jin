import { resolvePrecip, resolveSiteTheme, sunProgressForTime } from "./theme";
import type { WeatherKind } from "./api";
import type { Precip, SiteTheme, TimeOfDay } from "./theme";

export const OVERRIDE_KEY = "weather-override";

export type WeatherOverride = {
  time: TimeOfDay;
  weather: WeatherKind;
};

export type StoredThemeSnapshot = {
  theme: SiteTheme;
  precip: Precip;
};

export type StoredOverride = WeatherOverride & StoredThemeSnapshot;

const listeners = new Set<() => void>();

/** useSyncExternalStore — snapshot 참조 유지 */
let overrideSnapshot: WeatherOverride | null = null;
let overrideRaw: string | null | undefined = undefined;

function snapshotFor(
  weather: WeatherKind,
  sunProgress: number | null,
): StoredThemeSnapshot {
  return {
    theme: resolveSiteTheme(weather, sunProgress),
    precip: resolvePrecip(weather),
  };
}

function emitOverride() {
  for (const listener of listeners) listener();
}

function parseOverride(raw: string | null): WeatherOverride | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as Partial<StoredOverride>;
    if (parsed?.time !== "day" && parsed?.time !== "night") return null;
    if (!parsed?.weather) return null;
    return { time: parsed.time, weather: parsed.weather };
  } catch {
    return null;
  }
}

export function subscribeOverride(onStoreChange: () => void) {
  listeners.add(onStoreChange);
  return () => listeners.delete(onStoreChange);
}

export function getOverrideSnapshot(): WeatherOverride | null {
  const raw = localStorage.getItem(OVERRIDE_KEY);
  if (raw === overrideRaw) return overrideSnapshot;
  overrideRaw = raw;
  overrideSnapshot = parseOverride(raw);
  return overrideSnapshot;
}

export function getOverrideServerSnapshot(): WeatherOverride | null {
  return null;
}

export function writeStoredOverride(next: WeatherOverride | null) {
  if (typeof window === "undefined") return;
  try {
    if (!next) {
      localStorage.removeItem(OVERRIDE_KEY);
      overrideRaw = null;
      overrideSnapshot = null;
    } else {
      const sun = sunProgressForTime(next.time);
      const stored: StoredOverride = { ...next, ...snapshotFor(next.weather, sun) };
      const raw = JSON.stringify(stored);
      localStorage.setItem(OVERRIDE_KEY, raw);
      overrideRaw = raw;
      overrideSnapshot = { time: next.time, weather: next.weather };
    }
    emitOverride();
  } catch {
    /* ignore */
  }
}

/** 첫 페인트 전 localStorage 테마 복원 */
export const WEATHER_BOOT_SCRIPT = `(function(){try{var d=document.documentElement;var o=localStorage.getItem(${JSON.stringify(OVERRIDE_KEY)});if(!o)return;var p=JSON.parse(o);if(p.theme)d.dataset.theme=p.theme;if(p.precip!=null)d.dataset.precip=p.precip}catch(e){}})();`;
