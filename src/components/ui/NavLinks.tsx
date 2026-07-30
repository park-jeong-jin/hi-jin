"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function NavLinks() {
  const pathname = usePathname();
  const aboutActive = pathname === "/about";

  return (
    <nav className="flex items-center gap-1 font-mono text-[11px] tracking-[0.12em] text-muted uppercase sm:gap-2 sm:text-xs">
      <Link
        href="/about"
        className={`rounded-md px-2.5 py-1.5 transition ${
          aboutActive
            ? "bg-surface text-foreground"
            : "hover:bg-surface/70 hover:text-foreground"
        }`}
        aria-current={aboutActive ? "page" : undefined}
      >
        About
      </Link>
    </nav>
  );
}
