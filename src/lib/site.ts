/** 배포 URL — NEXT_PUBLIC_SITE_URL → Vercel → localhost */
export function getSiteUrl() {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  if (fromEnv) return fromEnv;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "http://localhost:3000";
}

export const SITE_NAME = "Hi_Jin's Notes";
export const SITE_DESCRIPTION =
  "머리가 맑을 때 적어 두고, 흐릴 때 다시 읽는 노트.";
