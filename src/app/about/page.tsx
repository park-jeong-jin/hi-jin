import Link from "next/link";
import type { Metadata } from "next";

const REPO_URL = "https://github.com/park-jeong-jin/hi-jin";

export const metadata: Metadata = {
  title: "About",
  description: "Hi_Jin's Notes — 개인 노트 블로그 소개",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "About",
    description: "Hi_Jin's Notes — 개인 노트 블로그 소개",
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
        Next.js와 MDX로 만든 개인 노트입니다.
      </p>

      <div className="mt-10 border-t border-line pt-8 max-w-2xl space-y-8 text-base leading-relaxed text-ink-soft sm:text-lg">
        <section className="space-y-3">
          <h2 className="text-lg tracking-tight text-foreground">배경 · 날씨</h2>
          <p>
            <a
              href="https://open-meteo.com/"
              className="text-foreground underline decoration-line underline-offset-4 transition hover:text-accent-ink hover:decoration-accent/50"
              target="_blank"
              rel="noreferrer"
            >
              Open-Meteo
            </a>
            로 여의도 기준 날씨·일출·일몰을 가져와, 하늘 색·해/달 위치·비/눈 장식을 맞춥니다.
            일출~일몰 사이는 시간에 따라 하늘이 바뀌고, 밤에는 도시 실루엣 창문 불빛이 켜집니다.
            헤더의 테마 버튼으로 시간·날씨를 수동으로 바꿀 수도 있습니다.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg tracking-tight text-foreground">기술 스택</h2>
          <p>
            Next.js(App Router), React, TypeScript, Tailwind CSS 4, MDX(
            <code className="text-[0.9em] text-foreground">next-mdx-remote</code>,{" "}
            <code className="text-[0.9em] text-foreground">gray-matter</code>,{" "}
            <code className="text-[0.9em] text-foreground">remark-gfm</code>), 코드
            하이라이트(
            <code className="text-[0.9em] text-foreground">rehype-pretty-code</code>,{" "}
            <code className="text-[0.9em] text-foreground">shiki</code>), 아이콘(
            <code className="text-[0.9em] text-foreground">lucide-react</code>).
            날씨는 별도 UI 라이브러리 없이 API 응답과 SVG·CSS로 처리했습니다.
          </p>
        </section>

        <section className="space-y-4">
          <p>
            글과 예제 코드는{" "}
            <Link href="/" className="text-foreground transition hover:text-accent-ink">
              홈 목록
            </Link>
            에서 볼 수 있습니다.
          </p>
          <p>
            블로그 사이트 코드는{" "}
            <a
              href={REPO_URL}
              className="text-foreground underline decoration-line underline-offset-4 transition hover:text-accent-ink hover:decoration-accent/50"
              target="_blank"
              rel="noreferrer"
            >
              GitHub
            </a>
            에 있습니다.
          </p>
        </section>
      </div>
    </div>
  );
}
