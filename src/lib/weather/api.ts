export type WeatherResponse = {
  current: {
    weather_code: number;
  };
  daily: {
    sunrise: string[];
    sunset: string[];
  };
};

export type WeatherKind = (typeof WEATHER)[keyof typeof WEATHER];

export type WeatherData = {
  /** sunProgress: 0=일출, 1=일몰, null=밤 */
  sunProgress: number | null;
  weather: WeatherKind;
};

/** Open-Meteo weather_code → WeatherKind */
export const WEATHER = {
  SUNNY: "SUNNY",
  CLOUDY: "CLOUDY",
  FOG: "FOG",
  RAIN: "RAIN",
  SNOW: "SNOW",
  STORM: "STORM",
} as const;

/** Open-Meteo 요청 파라미터 (여의도) */
const WEATHER_PARAMS = {
  latitude: 37.5219,
  longitude: 126.9245,
  current: "weather_code",
  daily: "sunrise,sunset",
  timezone: "Asia/Seoul",
  timeformat: "iso8601",
  forecast_days: 1,
} as const;

const WEATHER_URL = `https://api.open-meteo.com/v1/forecast?${new URLSearchParams(
  Object.entries(WEATHER_PARAMS).map(([key, value]) => [key, String(value)]),
)}`;

/** API 실패 시 fallback (06:00–18:00 → sunProgress, 그 외 null) */
export function getFallbackWeather(now = new Date()): WeatherData {
  const hours = now.getHours() + now.getMinutes() / 60 + now.getSeconds() / 3600;
  const sunProgress = hours < 6 || hours > 18 ? null : (hours - 6) / 12;

  return {
    weather: WEATHER.SUNNY,
    sunProgress,
  };
}

/** Open-Meteo 로컬 시각 → ms (Asia/Seoul) */
function seoulLocalToMs(localIso: string): number {
  const base = localIso.length === 16 ? `${localIso}:00` : localIso;
  return new Date(`${base}+09:00`).getTime();
}

function isWeatherResponse(value: unknown): value is WeatherResponse {
  if (!value || typeof value !== "object") return false;
  const v = value as WeatherResponse;
  return (
    typeof v.current?.weather_code === "number" &&
    Array.isArray(v.daily?.sunrise) &&
    Array.isArray(v.daily?.sunset) &&
    typeof v.daily.sunrise[0] === "string" &&
    typeof v.daily.sunset[0] === "string"
  );
}

const WEATHER_FETCH_TIMEOUT_MS = 1500;

/** Open-Meteo API fetch */
export async function fetchWeatherResponse(): Promise<WeatherResponse | null> {
  try {
    const res = await fetch(WEATHER_URL, {
      next: { revalidate: 600 },
      signal: AbortSignal.timeout(WEATHER_FETCH_TIMEOUT_MS),
    });
    if (!res.ok) return null;

    const json: unknown = await res.json();
    return isWeatherResponse(json) ? json : null;
  } catch {
    return null;
  }
}

/** API 응답 → WeatherData */
export async function getWeather(): Promise<WeatherData | null> {
  const json = await fetchWeatherResponse();
  return json ? formatWeather(json) : null;
}

/** WMO weather_code → WeatherKind */
export function getWeatherKind(code: number): WeatherKind {
  if (code === 0 || code === 1) return WEATHER.SUNNY;
  if (code === 2 || code === 3) return WEATHER.CLOUDY;
  if (code === 45 || code === 48) return WEATHER.FOG;
  if (code >= 51 && code <= 67) return WEATHER.RAIN;
  if (code >= 80 && code <= 82) return WEATHER.RAIN;
  if (code >= 71 && code <= 77) return WEATHER.SNOW;
  if (code === 85 || code === 86) return WEATHER.SNOW;
  if (code === 95 || code === 96 || code === 99) return WEATHER.STORM;
  return WEATHER.CLOUDY;
}

/** 일출·일몰 사이면 0–1, 아니면 null */
export function getSunProgress(
  sunrise: string,
  sunset: string,
  now: Date = new Date(),
): number | null {
  const rise = seoulLocalToMs(sunrise);
  const set = seoulLocalToMs(sunset);
  const t = now.getTime();
  if (!(t >= rise && t <= set) || set <= rise) return null;
  return (t - rise) / (set - rise);
}

export function formatWeather(json: WeatherResponse, now: Date = new Date()): WeatherData {
  const sunrise = json.daily.sunrise[0];
  const sunset = json.daily.sunset[0];

  return {
    weather: getWeatherKind(json.current.weather_code),
    sunProgress: getSunProgress(sunrise, sunset, now),
  };
}
