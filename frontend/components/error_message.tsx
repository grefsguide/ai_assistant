"use client";

import { AlertTriangle, RefreshCw } from "lucide-react";


interface ErrorMessageProps {
  message: string;
  action_label?: string;
  is_action_disabled?: boolean;
  on_action?: () => void;
}


export function ErrorMessage({
  message,
  action_label,
  is_action_disabled = false,
  on_action,
}: ErrorMessageProps) {
  if (!message) {
    return null;
  }

  return (
    <div
      role="alert"
      className="flex flex-col gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 sm:flex-row sm:items-start sm:justify-between"
    >
      <div className="flex items-start gap-3">
        <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
        <p>{message}</p>
      </div>

      {on_action && action_label ? (
        <button
          type="button"
          disabled={is_action_disabled}
          onClick={on_action}
          className="inline-flex min-h-9 shrink-0 items-center justify-center gap-2 rounded-lg border border-red-200 bg-white px-3 py-2 text-sm font-semibold text-red-800 transition hover:border-red-300 hover:bg-red-100 focus:outline-none focus:ring-4 focus:ring-red-100 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <RefreshCw className="h-4 w-4" aria-hidden="true" />
          {action_label}
        </button>
      ) : null}
    </div>
  );
}
