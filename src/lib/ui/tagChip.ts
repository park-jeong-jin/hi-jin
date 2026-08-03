const TAG_CHIP_HOVER =
  "hover:border-accent/55 hover:bg-accent/28 hover:text-accent-ink";

const TAG_CHIP_BASE =
  `inline-flex items-center rounded-md border border-transparent bg-surface px-2.5 py-1 font-mono text-[11px] tracking-[0.04em] text-muted transition ${TAG_CHIP_HOVER}`;

/** 태그 필터로 이동하는 칩 */
export function tagChipLinkClass() {
  return TAG_CHIP_BASE;
}

/** 태그 필터 토글 칩 */
export function toggleChipClass(active: boolean) {
  return `inline-flex items-center rounded-md border px-2.5 py-1 font-mono text-[11px] tracking-[0.04em] transition ${
    active
      ? "border-foreground bg-foreground text-background hover:border-accent hover:bg-accent hover:text-background"
      : `border-transparent bg-surface text-muted ${TAG_CHIP_HOVER}`
  }`;
}
