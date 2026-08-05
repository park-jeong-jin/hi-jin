import { WEATHER } from "./api";
import { resolvePrecip, resolveSiteTheme } from "./theme";
import type { WeatherKind } from "./api";
import type { Precip, SiteTheme } from "./theme";

export const OVERRIDE_KEY = "weather-override";

export type WeatherOverride = {
  isDay: boolean;
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

function snapshotFor(weather: WeatherKind, isDay: boolean): StoredThemeSnapshot {
  return {
    theme: resolveSiteTheme(weather, isDay),
    precip: resolvePrecip(weather),
  };
}

function emitOverride() {
  for (const listener of listeners) listener();
}

function isWeatherKind(value: unknown): value is WeatherKind {
  return (
    typeof value === "string" && (Object.values(WEATHER) as string[]).includes(value)
  );
}

function parseOverride(raw: string | null): WeatherOverride | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as Partial<StoredOverride>;
    if (typeof parsed?.isDay !== "boolean") return null;
    if (!isWeatherKind(parsed?.weather)) return null;
    return { isDay: parsed.isDay, weather: parsed.weather };
  } catch {
    return null;
  }
}

export function subscribeOverride(onStoreChange: () => void) {
  listeners.add(onStoreChange);
  const onStorage = (e: StorageEvent) => {
    if (e.key === null || e.key === OVERRIDE_KEY) onStoreChange();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(onStoreChange);
    window.removeEventListener("storage", onStorage);
  };
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
      const stored: StoredOverride = {
        ...next,
        ...snapshotFor(next.weather, next.isDay),
      };
      const raw = JSON.stringify(stored);
      localStorage.setItem(OVERRIDE_KEY, raw);
      overrideRaw = raw;
      overrideSnapshot = { isDay: next.isDay, weather: next.weather };
    }
    emitOverride();
  } catch {
    /* ignore */
  }
}

/** 첫 페인트 전 localStorage 테마 복원 */
export const WEATHER_BOOT_SCRIPT = `(function(){try{var d=document.documentElement;var o=localStorage.getItem(${JSON.stringify(OVERRIDE_KEY)});if(!o)return;var p=JSON.parse(o);if(p.theme)d.dataset.theme=p.theme;if(p.precip!=null)d.dataset.precip=p.precip}catch(e){}})();`;
