import Link from "next/link";
import { NavLinks } from "@/components/ui/NavLinks";
import { ThemeMenu } from "@/components/weather";

export function SiteHeader() {
  return (
    <header className="relative z-50 shrink-0 bg-transparent">
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between gap-4 px-4 py-3 sm:px-6 sm:py-4">
        <Link
          href="/"
          className="text-lg tracking-tight text-foreground transition hover:text-accent-ink sm:text-xl"
        >
          Hi_Jin&apos;s Notes
        </Link>
        <div className="flex items-center gap-1 sm:gap-2">
          <NavLinks />
          <ThemeMenu />
        </div>
      </div>
    </header>
  );
}
