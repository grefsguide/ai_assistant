"use client";

import { useEffect } from "react";

import { CrashFallback } from "@/components/crash_fallback";


export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Application crashed", error);
  }, [error]);

  return (
    <html lang="ru">
      <body>
        <CrashFallback
          title="Приложение временно недоступно"
          message="Произошла ошибка на уровне приложения. Можно попробовать восстановить интерфейс без перезапуска вкладки."
          on_reset={reset}
        />
      </body>
    </html>
  );
}
