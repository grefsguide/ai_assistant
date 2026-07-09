"use client";

import { Check, Copy } from "lucide-react";


interface CopyAnswerButtonProps {
  answer: string;
  copied: boolean;
  disabled?: boolean;
  on_copy: () => void;
}


export function CopyAnswerButton({
  answer,
  copied,
  disabled = false,
  on_copy,
}: CopyAnswerButtonProps) {
  const is_disabled = disabled || !answer.trim();

  return (
    <button
      type="button"
      disabled={is_disabled}
      onClick={on_copy}
      className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-800 transition hover:border-emerald-300 hover:text-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-100 disabled:cursor-not-allowed disabled:bg-zinc-50 disabled:text-zinc-400"
    >
      {copied ? (
        <Check className="h-4 w-4" aria-hidden="true" />
      ) : (
        <Copy className="h-4 w-4" aria-hidden="true" />
      )}
      {copied ? "Скопировано" : "Копировать ответ"}
    </button>
  );
}
