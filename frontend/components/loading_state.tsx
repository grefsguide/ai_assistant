"use client";

import { Loader2 } from "lucide-react";


export function LoadingState() {
  return (
    <section className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm">
      <div className="mb-5 flex items-center justify-between gap-4">
        <h2 className="text-lg font-semibold text-zinc-950">Ответ AI</h2>
        <div className="inline-flex items-center gap-2 text-sm font-medium text-emerald-700">
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
          AI думает...
        </div>
      </div>

      <div className="space-y-3" aria-label="Загрузка ответа">
        <div className="h-4 w-11/12 animate-pulse rounded bg-zinc-100" />
        <div className="h-4 w-full animate-pulse rounded bg-zinc-100" />
        <div className="h-4 w-8/12 animate-pulse rounded bg-zinc-100" />
        <div className="mt-5 h-24 w-full animate-pulse rounded-lg bg-zinc-100" />
      </div>
    </section>
  );
}
