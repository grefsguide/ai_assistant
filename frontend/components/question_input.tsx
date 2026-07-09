"use client";

import { Send } from "lucide-react";
import type { FormEvent } from "react";

import { ModeSelector } from "@/components/mode_selector";
import type { AssistantMode } from "@/types/chat_types";


interface QuestionInputProps {
  question: string;
  selected_mode: AssistantMode;
  is_loading: boolean;
  max_length: number;
  on_question_change: (value: string) => void;
  on_mode_change: (mode: AssistantMode) => void;
  on_submit: () => void;
}


export function QuestionInput({
  question,
  selected_mode,
  is_loading,
  max_length,
  on_question_change,
  on_mode_change,
  on_submit,
}: QuestionInputProps) {
  function handle_submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    on_submit();
  }

  return (
    <form onSubmit={handle_submit} className="space-y-4">
      <ModeSelector
        selected_mode={selected_mode}
        disabled={is_loading}
        on_mode_change={on_mode_change}
      />

      <label htmlFor="question" className="sr-only">
        Вопрос AI-ассистенту
      </label>

      <textarea
        id="question"
        value={question}
        maxLength={max_length}
        disabled={is_loading}
        onChange={(event) => on_question_change(event.target.value)}
        placeholder="Введите вопрос для AI-ассистента..."
        className="min-h-44 w-full resize-y rounded-lg border border-zinc-200 bg-white px-4 py-4 text-base leading-7 text-zinc-950 shadow-sm outline-none transition placeholder:text-zinc-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 disabled:cursor-not-allowed disabled:bg-zinc-50 sm:min-h-56"
      />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <span className="text-sm text-zinc-500">
          {question.length} / {max_length}
        </span>

        <button
          type="submit"
          disabled={is_loading || !question.trim()}
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-zinc-950 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-zinc-800 focus:outline-none focus:ring-4 focus:ring-emerald-100 disabled:cursor-not-allowed disabled:bg-zinc-300"
        >
          <Send className="h-4 w-4" aria-hidden="true" />
          {is_loading ? "AI думает..." : "Спросить AI"}
        </button>
      </div>
    </form>
  );
}
