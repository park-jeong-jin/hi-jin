"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useSyncExternalStore,
} from "react";
import {
  getOverrideServerSnapshot,
  getOverrideSnapshot,
  resolvePrecip,
  resolveSiteTheme,
  subscribeOverride,
  sunProgressForTime,
  timeFromSunProgress,
  writeStoredOverride,
} from "@/lib/weather";
import { WeatherDecor } from "./WeatherDecor";
import type { ReactNode } from "react";
import type {
  Precip,
  SiteTheme,
  TimeOfDay,
  WeatherData,
  WeatherKind,
  WeatherOverride,
} from "@/lib/weather";

type WeatherContextValue = {
  kind: WeatherKind;
  sunProgress: number | null;
  theme: SiteTheme;
  precip: Precip;
  mode: "auto" | "manual";
  time: TimeOfDay;
  setAuto: () => void;
  setManual: (next: Partial<WeatherOverride>) => void;
};

const WeatherContext = createContext<WeatherContextValue | null>(null);

export function useWeather() {
  const ctx = useContext(WeatherContext);
  if (!ctx) throw new Error("useWeather must be used within WeatherProvider");
  return ctx;
}

export function WeatherProvider({
  weather,
  children,
}: {
  weather: WeatherData;
  children: ReactNode;
}) {
  const override = useSyncExternalStore(
    subscribeOverride,
    getOverrideSnapshot,
    getOverrideServerSnapshot,
  );

  const mode: "auto" | "manual" = override ? "manual" : "auto";
  const kind = override?.weather ?? weather.weather;
  const sunProgress = override ? sunProgressForTime(override.time) : weather.sunProgress;
  const time = override?.time ?? timeFromSunProgress(weather.sunProgress);
  const theme = resolveSiteTheme(kind, sunProgress);
  const precip = resolvePrecip(kind);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.dataset.precip = precip;
  }, [theme, precip]);

  const setAuto = useCallback(() => {
    writeStoredOverride(null);
  }, []);

  const setManual = useCallback(
    (next: Partial<WeatherOverride>) => {
      writeStoredOverride({
        time: next.time ?? override?.time ?? timeFromSunProgress(weather.sunProgress),
        weather: next.weather ?? override?.weather ?? weather.weather,
      });
    },
    [override, weather.sunProgress, weather.weather],
  );

  const value = useMemo(
    (): WeatherContextValue => ({
      kind,
      sunProgress,
      theme,
      precip,
      mode,
      time,
      setAuto,
      setManual,
    }),
    [kind, sunProgress, theme, precip, mode, time, setAuto, setManual],
  );

  return (
    <WeatherContext.Provider value={value}>
      {children}
      <WeatherDecor precip={precip} />
    </WeatherContext.Provider>
  );
}
