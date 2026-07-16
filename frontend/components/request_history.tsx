"use client";

import { History } from "lucide-react";


interface RequestHistoryProps {
  history: string[];
  on_select_question: (question: string) => void;
}


export function RequestHistory({
  history,
  on_select_question,
}: RequestHistoryProps) {
  return (
    <aside className="min-w-0 overflow-hidden rounded-lg border border-zinc-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex min-w-0 items-center gap-2">
        <History className="h-5 w-5 text-emerald-700" aria-hidden="true" />
        <h2 className="min-w-0 text-lg font-semibold text-zinc-950">
          Последние вопросы
        </h2>
      </div>

      {history.length > 0 ? (
        <div className="space-y-2">
          {history.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => on_select_question(item)}
              className="w-full min-w-0 break-words rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-3 text-left text-sm leading-6 text-zinc-700 transition hover:border-emerald-300 hover:bg-emerald-50 hover:text-zinc-950 focus:outline-none focus:ring-4 focus:ring-emerald-100"
            >
              {item}
            </button>
          ))}
        </div>
      ) : (
        <div className="rounded-lg border border-dashed border-zinc-200 bg-zinc-50 px-4 py-8 text-center text-sm text-zinc-500">
          История появится после первого запроса.
        </div>
      )}
    </aside>
  );
}
