import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { SITE_DESCRIPTION, SITE_NAME } from "@/lib/site";

export const alt = SITE_NAME;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Gowun Dodum — SIL OFL 1.1 (assets/fonts/OFL.txt) */
export default async function Image() {
  const gowunDodum = await readFile(
    join(process.cwd(), "assets/fonts/GowunDodum-Regular.ttf"),
  );

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
        fontFamily: "Gowun Dodum",
      }}
    >
      <div style={{ display: "flex", fontSize: 72, color: "#1a2230" }}>{SITE_NAME}</div>
      <div style={{ display: "flex", marginTop: 20, fontSize: 32, color: "#5c6b7c" }}>
        {SITE_DESCRIPTION}
      </div>
    </div>,
    {
      ...size,
      fonts: [{ name: "Gowun Dodum", data: gowunDodum, style: "normal", weight: 400 }],
    },
  );
}
