import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { SITE_DESCRIPTION, SITE_NAME } from "@/lib/site";

export const alt = SITE_NAME;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Gothic A1 — SIL OFL 1.1 (assets/fonts/OFL.txt) */
export default async function Image() {
  const gothicA1 = await readFile(join(process.cwd(), "assets/fonts/GothicA1-Regular.ttf"));

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(180deg, #b9d8f5 0%, #f4f7fb 42%, #e8f1fa 100%)",
        fontFamily: "Gothic A1",
      }}
    >
      <div style={{ display: "flex", fontSize: 96, color: "#1a2230" }}>{SITE_NAME}</div>
      <div style={{ display: "flex", marginTop: 28, fontSize: 40, color: "#5c6b7c" }}>
        {SITE_DESCRIPTION}
      </div>
    </div>,
    {
      ...size,
      fonts: [{ name: "Gothic A1", data: gothicA1, style: "normal", weight: 400 }],
    },
  );
}
