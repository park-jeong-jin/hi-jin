import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { getPostBySlug, getPostSlugs } from "@/lib/posts";
import { SITE_NAME } from "@/lib/site";
import { tagLabel } from "@/lib/taxonomy";

export const alt = "글 미리보기 이미지";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

type ImageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getPostSlugs().map((slug) => ({ slug }));
}

/** Gothic A1 — SIL OFL 1.1 (assets/fonts/OFL.txt) */
export default async function Image({ params }: ImageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  const gothicA1 = await readFile(join(process.cwd(), "assets/fonts/GothicA1-Regular.ttf"));

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: 64,
        background: "linear-gradient(180deg, #b9d8f5 0%, #f4f7fb 42%, #e8f1fa 100%)",
        fontFamily: "Gothic A1",
      }}
    >
      <div style={{ display: "flex", fontSize: 32, color: "#9a6a00", letterSpacing: 2 }}>
        {post.tags.map(tagLabel).join("  ·  ")}
      </div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", fontSize: 76, color: "#1a2230", lineHeight: 1.3 }}>
          {post.title}
        </div>
        <div style={{ display: "flex", marginTop: 28, fontSize: 32, color: "#5c6b7c" }}>
          {post.date} · {SITE_NAME}
        </div>
      </div>
    </div>,
    {
      ...size,
      fonts: [{ name: "Gothic A1", data: gothicA1, style: "normal", weight: 400 }],
    },
  );
}
