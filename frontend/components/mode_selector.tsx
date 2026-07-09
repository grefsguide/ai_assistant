"use client";

import { Calculator, Code2, MessageSquare } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import type { AssistantMode } from "@/types/chat_types";


interface ModeOption {
  value: AssistantMode;
  label: string;
  Icon: LucideIcon;
}


const mode_options: ModeOption[] = [
  { value: "general", label: "Общий", Icon: MessageSquare },
  { value: "code", label: "Код", Icon: Code2 },
  { value: "math", label: "Математика", Icon: Calculator },
];


interface ModeSelectorProps {
  selected_mode: AssistantMode;
  disabled: boolean;
  on_mode_change: (mode: AssistantMode) => void;
}


export function ModeSelector({
  selected_mode,
  disabled,
  on_mode_change,
}: ModeSelectorProps) {
  return (
    <div
      role="radiogroup"
      aria-label="Режим ответа AI"
      className="grid grid-cols-1 gap-2 rounded-lg bg-zinc-100 p-1 sm:grid-cols-3"
    >
      {mode_options.map(({ value, label, Icon }) => {
        const is_selected = selected_mode === value;

        return (
          <button
            key={value}
            type="button"
            role="radio"
            aria-checked={is_selected}
            disabled={disabled}
            onClick={() => on_mode_change(value)}
            className={[
              "inline-flex min-h-11 items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-semibold transition focus:outline-none focus:ring-4 focus:ring-emerald-100 disabled:cursor-not-allowed",
              is_selected
                ? "bg-white text-zinc-950 shadow-sm"
                : "text-zinc-600 hover:bg-white/70 hover:text-zinc-950",
            ].join(" ")}
          >
            <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
            <span className="truncate">{label}</span>
          </button>
        );
      })}
    </div>
  );
}
