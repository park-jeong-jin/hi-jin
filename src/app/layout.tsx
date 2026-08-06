import "@/styles/globals.css";
import { Gothic_A1, JetBrains_Mono } from "next/font/google";
import { PagePanel } from "@/components/ui/PagePanel";
import { SiteHeader } from "@/components/ui/SiteHeader";
import { WeatherProvider } from "@/components/weather/WeatherProvider";
import { getSiteUrl, SITE_DESCRIPTION, SITE_NAME } from "@/lib/site";
import {
  getFallbackWeather,
  getWeather,
  resolvePrecip,
  resolveSiteTheme,
  WEATHER_BOOT_SCRIPT,
} from "@/lib/weather";
import type { Metadata } from "next";

const gothicA1 = Gothic_A1({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-gothic",
});

const jetbrainsMono = JetBrains_Mono({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
});

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: SITE_NAME,
    template: `%s · ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  openGraph: {
    type: "website",
    locale: "ko_KR",
    siteName: SITE_NAME,
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
  },
  alternates: {
    canonical: "/",
  },
  verification: {
    google: "8o4JNRqv-by7CgfUga_6jkQlPQIof-AVfehj0bP5Y4Y",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const weather = (await getWeather()) ?? getFallbackWeather();
  const theme = resolveSiteTheme(weather.weather, weather.isDay);
  const precip = resolvePrecip(weather.weather);

  return (
    <html
      lang="ko"
      data-theme={theme}
      data-precip={precip}
      className={`${gothicA1.variable} ${jetbrainsMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        {/* 첫 페인트 전 수동 테마 적용 */}
        <script dangerouslySetInnerHTML={{ __html: WEATHER_BOOT_SCRIPT }} />
      </head>
      <body className="flex h-dvh flex-col overflow-hidden font-sans">
        <WeatherProvider weather={weather}>
          <div className="relative z-10 flex min-h-0 flex-1 flex-col">
            <SiteHeader />
            <main className="scroll-theme min-h-0 w-full flex-1 overflow-y-auto">
              <div className="mx-auto w-full max-w-5xl px-3 sm:px-4">
                <PagePanel className="mt-8 mb-4 sm:mt-12">{children}</PagePanel>
              </div>
            </main>
            <footer className="relative z-20 mx-auto w-full shrink-0 max-w-5xl bg-transparent px-4 py-4 font-mono text-[11px] tracking-[0.08em] text-muted sm:px-6 sm:py-5 sm:text-xs">
              © {new Date().getFullYear()} Hi_Jin&apos;s Notes
            </footer>
          </div>
        </WeatherProvider>
      </body>
    </html>
  );
}
