# Hi_Jin's Notes

Next.js(Active LTS) + MDX 노트.

## Stack

- Next.js 16.2 (App Router, Turbopack)
- MDX (`next-mdx-remote`) + `content/posts/*.mdx`
- Tailwind CSS 4

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

## 글 추가

1. `content/posts/my-post.mdx` 생성
2. frontmatter 채우기:

```mdx
---
title: "제목"
description: "한 줄 요약"
date: "2026-07-24"
tags: ["react"] # src/lib/taxonomy.ts 의 TAGS만 사용
---

본문...

<DemoCounter />
```

정보 구조:

- `/` — 글 목록 (+ `?tag=` 필터)
- `/about` — 소개
- `/[slug]` — 글 상세
- 태그 상수: `src/lib/taxonomy.ts`
- 글 파일명 예약: `about` 등 (`RESERVED_SLUGS` in `src/lib/posts.ts`) — `/[slug]`와 겹침 방지
- (레거시) `/posts`, `/posts/:slug` → `/`, `/:slug` 리다이렉트

3. 새 라이브 데모가 필요하면:
   - `src/components/mdx/MyDemo.tsx` 작성
   - `src/components/mdx-components.tsx`에 등록

## Deploy (Vercel)

1. GitHub에 푸시
2. [vercel.com](https://vercel.com) → Import project
3. Framework Preset: Next.js 그대로 배포

```bash
pnpm build
```
