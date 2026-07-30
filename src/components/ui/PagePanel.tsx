import type { ReactNode } from "react";

/** 본문 패널. 홈은 className으로 상단 여백 추가 */
export function PagePanel({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-2xl bg-background/70 px-4 py-6 backdrop-blur-md sm:px-6 sm:py-8 ${className}`}
    >
      {children}
    </div>
  );
}
