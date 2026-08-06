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
  writeStoredOverride,
} from "@/lib/weather";
import { WeatherDecor } from "./WeatherDecor";
import type { ReactNode } from "react";
import type {
  Precip,
  SiteTheme,
  WeatherData,
  WeatherKind,
  WeatherOverride,
} from "@/lib/weather";

type WeatherContextValue = {
  kind: WeatherKind;
  isDay: boolean;
  theme: SiteTheme;
  precip: Precip;
  mode: "auto" | "manual";
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
  const isDay = override?.isDay ?? weather.isDay;
  const theme = resolveSiteTheme(kind, isDay);
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
        isDay: next.isDay ?? override?.isDay ?? weather.isDay,
        weather: next.weather ?? override?.weather ?? weather.weather,
      });
    },
    [override, weather.isDay, weather.weather],
  );

  const value = useMemo(
    (): WeatherContextValue => ({
      kind,
      isDay,
      theme,
      precip,
      mode,
      setAuto,
      setManual,
    }),
    [kind, isDay, theme, precip, mode, setAuto, setManual],
  );

  return (
    <WeatherContext.Provider value={value}>
      {children}
      <WeatherDecor precip={precip} />
    </WeatherContext.Provider>
  );
}
