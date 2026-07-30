import { WEATHER } from "./api";
import type { WeatherKind } from "./api";

export type SiteTheme = (typeof SITE_THEME)[keyof typeof SITE_THEME];

export type Precip = "none" | "rain" | "snow";

/** ThemeMenu 시간 선택값 */
export type TimeOfDay = "day" | "night";

export const SITE_THEME = {
  DAY: "day",
  OVERCAST: "overcast",
  NIGHT: "night",
} as const;

/** 수동 time → sunProgress */
export function sunProgressForTime(time: TimeOfDay): number | null {
  if (time === "night") return null;
  return 0.5;
}

/** sunProgress → time */
export function timeFromSunProgress(sunProgress: number | null): TimeOfDay {
  return sunProgress == null ? "night" : "day";
}

/** time + weather → data-theme (강수는 precip로 분리) */
export function resolveSiteTheme(
  weather: WeatherKind,
  sunProgress: number | null,
): SiteTheme {
  if (sunProgress == null) return SITE_THEME.NIGHT;
  if (weather === WEATHER.SUNNY) return SITE_THEME.DAY;
  return SITE_THEME.OVERCAST;
}

/** weather → precip 오버레이 */
export function resolvePrecip(weather: WeatherKind): Precip {
  if (weather === WEATHER.RAIN || weather === WEATHER.STORM) return "rain";
  if (weather === WEATHER.SNOW) return "snow";
  return "none";
}
