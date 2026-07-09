"use client";

import { AlertTriangle } from "lucide-react";


interface ErrorMessageProps {
  message: string;
}


export function ErrorMessage({ message }: ErrorMessageProps) {
  if (!message) {
    return null;
  }

  return (
    <div
      role="alert"
      className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
    >
      <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
      <p>{message}</p>
    </div>
  );
}
