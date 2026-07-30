import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description: "웹 개발자 Hi_Jin 소개",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "About",
    description: "웹 개발자 Hi_Jin 소개",
    url: "/about",
  },
};

export default function AboutPage() {
  return (
    <div>
      <p className="font-mono text-[11px] tracking-[0.14em] text-muted uppercase sm:text-xs">
        About
      </p>
      <h1 className="mt-2 text-3xl tracking-tight text-foreground sm:text-4xl">
        Hi_Jin&apos;s Notes
      </h1>
      <p className="mt-4 max-w-2xl text-base leading-relaxed text-ink-soft sm:text-lg">
        Next.js와 MDX로 만든 개인 노트입니다.{" "}
        <Link href="/" className="underline decoration-accent/50 underline-offset-4">
          홈
        </Link>
        에 글을 모아 둡니다.
      </p>

      <div className="mt-10 border-t border-line pt-8">
        <h2 className="text-xl tracking-tight text-foreground">소개</h2>
        <p className="mt-3 max-w-2xl text-base leading-relaxed text-ink-soft sm:text-lg">
          웹 개발자입니다. 머리가 맑을 때 적어 두고, 흐릴 때 다시 읽습니다.
        </p>

        <h3 className="mt-10 text-lg tracking-tight text-foreground">경력</h3>
        <ul className="mt-4 space-y-5">
          <li>
            <p className="font-mono text-[11px] tracking-[0.08em] text-muted uppercase sm:text-xs">
              2023.06 –
            </p>
            <p className="mt-1 text-foreground">클라우드 모니터링 · 관리 솔루션</p>
            <p className="mt-1 text-sm leading-relaxed text-ink-soft sm:text-base">
              모니터링 대시보드, 실시간 토폴로지 맵, 물리 인프라 관리 UI를 만들고
              있습니다.
            </p>
          </li>
          <li>
            <p className="font-mono text-[11px] tracking-[0.08em] text-muted uppercase sm:text-xs">
              2019.01 – 2023.06
            </p>
            <p className="mt-1 text-foreground">건설 ERP</p>
            <p className="mt-1 text-sm leading-relaxed text-ink-soft sm:text-base">
              ERP·연계 웹 개발·유지보수와 WinForms → 웹 마이그레이션을 담당했습니다.
            </p>
          </li>
        </ul>

        <h3 className="mt-10 text-lg tracking-tight text-foreground">스킬</h3>
        <dl className="mt-4 space-y-3 text-sm sm:text-base">
          <div>
            <dt className="font-mono text-[11px] tracking-[0.08em] text-muted uppercase sm:text-xs">
              Frontend
            </dt>
            <dd className="mt-1 leading-relaxed text-ink-soft">
              Vue, Pinia, TanStack Query, React, Next.js, TypeScript
            </dd>
          </div>
          <div>
            <dt className="font-mono text-[11px] tracking-[0.08em] text-muted uppercase sm:text-xs">
              Visualization · Interaction
            </dt>
            <dd className="mt-1 leading-relaxed text-ink-soft">
              ECharts, AntV G6, Chart.js, interact.js, RSocket
            </dd>
          </div>
          <div>
            <dt className="font-mono text-[11px] tracking-[0.08em] text-muted uppercase sm:text-xs">
              Backend · Data
            </dt>
            <dd className="mt-1 leading-relaxed text-ink-soft">
              Java, Spring Boot, MyBatis, ASP.NET, C#, VB.NET, MS SQL
            </dd>
          </div>
          <div>
            <dt className="font-mono text-[11px] tracking-[0.08em] text-muted uppercase sm:text-xs">
              Reporting
            </dt>
            <dd className="mt-1 leading-relaxed text-ink-soft">
              Crystal Reports, OZ Report
            </dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
