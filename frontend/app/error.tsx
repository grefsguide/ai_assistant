"use client";

import { useEffect } from "react";

import { CrashFallback } from "@/components/crash_fallback";


export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Page crashed", error);
  }, [error]);

  return (
    <CrashFallback
      title="Страница временно недоступна"
      message="Попробуйте восстановить страницу. Если ошибка повторится, перезапустите frontend dev server и проверьте консоль."
      on_reset={reset}
    />
  );
}
