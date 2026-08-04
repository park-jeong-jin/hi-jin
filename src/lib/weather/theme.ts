import { WEATHER } from "./api";
import type { WeatherKind } from "./api";

export type SiteTheme = (typeof SITE_THEME)[keyof typeof SITE_THEME];

export type Precip = "none" | "rain" | "snow";

export const SITE_THEME = {
  DAY: "day",
  OVERCAST: "overcast",
  NIGHT: "night",
} as const;

/** 낮·밤 + weather → data-theme (강수는 precip로 분리) */
export function resolveSiteTheme(weather: WeatherKind, isDay: boolean): SiteTheme {
  if (!isDay) return SITE_THEME.NIGHT;
  if (weather === WEATHER.SUNNY) return SITE_THEME.DAY;
  return SITE_THEME.OVERCAST;
}

/** weather → precip 오버레이 */
export function resolvePrecip(weather: WeatherKind): Precip {
  if (weather === WEATHER.RAIN || weather === WEATHER.STORM) return "rain";
  if (weather === WEATHER.SNOW) return "snow";
  return "none";
}
