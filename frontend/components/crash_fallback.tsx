"use client";

import { Home, RefreshCw } from "lucide-react";


interface CrashFallbackProps {
  title?: string;
  message?: string;
  on_reset?: () => void;
}


export function CrashFallback({
  title = "Что-то пошло не так",
  message = "Интерфейс временно не смог продолжить работу. Данные ключей и технические детали не показываются.",
  on_reset,
}: CrashFallbackProps) {
  return (
    <main className="min-h-screen bg-[#f7f7f4] px-4 py-6 text-zinc-950 sm:px-6 lg:px-8">
      <section className="mx-auto flex min-h-[70vh] w-full max-w-2xl flex-col justify-center">
        <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm">
          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.12em] text-red-700">
            Ошибка
          </p>
          <h1 className="text-2xl font-bold text-zinc-950">{title}</h1>
          <p className="mt-3 text-base leading-7 text-zinc-600">{message}</p>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            {on_reset ? (
              <button
                type="button"
                onClick={on_reset}
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-zinc-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-zinc-800 focus:outline-none focus:ring-4 focus:ring-emerald-100"
              >
                <RefreshCw className="h-4 w-4" aria-hidden="true" />
                Повторить
              </button>
            ) : null}

            <a
              href="/"
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-zinc-200 bg-white px-5 py-3 text-sm font-semibold text-zinc-800 transition hover:border-emerald-300 hover:text-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-100"
            >
              <Home className="h-4 w-4" aria-hidden="true" />
              На главную
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
