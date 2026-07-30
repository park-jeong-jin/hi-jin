/** 글 목록·상세 태그 칩 */
export function tagChipClass() {
  return "inline-flex items-center rounded-md bg-surface px-2.5 py-1 font-mono text-[11px] tracking-[0.06em] text-muted uppercase";
}

/** 태그 필터 토글 칩 */
export function toggleChipClass(active: boolean) {
  return `inline-flex items-center rounded-md px-2.5 py-1 font-mono text-[11px] tracking-[0.06em] uppercase transition ${
    active
      ? "bg-foreground text-background"
      : "bg-surface text-muted hover:bg-surface/80 hover:text-foreground"
  }`;
}
