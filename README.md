# Hi_Jin's Notes

Next.js + MDX 개인 노트 블로그.

- **Live:** [hi-jin-blush.vercel.app](https://hi-jin-blush.vercel.app)

## Stack

- Next.js 16 (App Router) · React 19 · TypeScript
- MDX (`next-mdx-remote`, `gray-matter`, `remark-gfm`) · `content/posts/*.mdx`
- 코드 하이라이트 (`rehype-pretty-code`, Shiki)
- Tailwind CSS 4 · `lucide-react`
- 날씨/테마 UI ([Open-Meteo](https://open-meteo.com/), SVG·CSS)
- 댓글 ([Giscus](https://giscus.app/ko) → GitHub Discussions)

## Develop

```bash
pnpm install
pnpm dev
```

포맷/린트:

```bash
pnpm format
pnpm lint
```

## Routes

- `/` — 글 목록 (`?tag=` 필터)
- `/about` — 소개
- `/[slug]` — 글 상세 (댓글 포함)
- 태그: `src/lib/taxonomy.ts`의 `TAGS`
- slug 예약: `RESERVED_SLUGS` in `src/lib/posts.ts` (`about` 등)

## 글 추가

1. `content/posts/my-post.mdx` 생성
2. frontmatter:

```mdx
---
title: "제목"
description: "한 줄 요약"
date: "2026-07-24"
tags: ["react"] # TAGS만 사용
---

본문...

<DemoCounter />
```

3. 새 MDX 컴포넌트가 필요하면:
   - `src/components/mdx/MyDemo.tsx` 작성
   - `src/components/mdx/components.tsx`의 `createMdxComponents` 반환 객체에 등록

## 댓글 (Giscus)

- 글 상세(`/[slug]`)에만 표시
- 설정: `src/lib/giscus.ts` · 컴포넌트: `src/components/comments/GiscusComments.tsx`
- repo에서 Discussions 활성화 + [Giscus 앱](https://github.com/apps/giscus) 설치 필요

## Deploy (Vercel)

1. GitHub에 푸시 → [vercel.com](https://vercel.com)에서 Import
2. Framework Preset: Next.js
3. (권장) Environment Variables:

```bash
NEXT_PUBLIC_SITE_URL=https://hi-jin-blush.vercel.app
```

canonical·sitemap·Open Graph URL에 사용됩니다. 미설정 시 Vercel 배포 URL로 fallback.

```bash
pnpm build
```

SEO: `src/app/robots.ts`, `src/app/sitemap.ts` (자동 생성)

## 프로젝트 구조 (요약)

```
src/app/
  layout.tsx    # 헤더·푸터·PagePanel·날씨
  page.tsx      # /
  about/
  [slug]/
content/posts/  # MDX 글
```
