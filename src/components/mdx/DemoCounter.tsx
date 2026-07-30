"use client";

import { useState } from "react";

export function DemoCounter() {
  const [count, setCount] = useState(0);

  return (
    <div className="my-8 rounded-xl border border-line bg-surface p-5">
      <p className="mb-3 font-mono text-xs tracking-[0.14em] text-muted uppercase">
        Live demo · setState
      </p>
      <p className="mb-4 text-3xl font-semibold tracking-tight text-foreground">
        {count}
      </p>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setCount((c) => c + 1)}
          className="rounded-md bg-foreground px-3 py-2 text-sm text-background transition hover:opacity-90"
        >
          +1
        </button>
        <button
          type="button"
          onClick={() => setCount(0)}
          className="rounded-md border border-line px-3 py-2 text-sm text-ink-soft transition hover:bg-white/40"
        >
          Reset
        </button>
      </div>
    </div>
  );
}
