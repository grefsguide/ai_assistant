"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { ReactNode } from "react";

import { get_plain_code_answer } from "@/lib/code_answer";
import type { AssistantMode } from "@/types/chat_types";


interface AnswerCardProps {
  answer: string;
  model: string;
  request_id: string;
  mode: AssistantMode;
  actions: ReactNode;
}


export function AnswerCard({
  answer,
  model,
  request_id,
  mode,
  actions,
}: AnswerCardProps) {
  const has_answer = Boolean(answer.trim());
  const is_code_mode = mode === "code";

  return (
    <section className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm">
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-lg font-semibold text-zinc-950">Ответ AI</h2>
        {actions}
      </div>

      {has_answer ? (
        <>
          {is_code_mode ? (
            <pre className="max-h-[70vh] overflow-x-auto rounded-lg bg-zinc-950 p-4 text-sm leading-6 text-zinc-50 shadow-inner">
              <code className="font-mono">{get_plain_code_answer(answer)}</code>
            </pre>
          ) : (
            <div className="prose prose-zinc max-w-none prose-headings:scroll-mt-20 prose-headings:text-zinc-950 prose-a:text-emerald-700 prose-pre:rounded-lg prose-pre:bg-zinc-950 prose-pre:p-4 prose-pre:text-zinc-50">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  code({ className, children, ...props }) {
                    const is_block_code = Boolean(className);

                    return (
                      <code
                        className={
                          is_block_code
                            ? className
                            : "rounded bg-zinc-100 px-1.5 py-0.5 text-[0.9em] text-zinc-900"
                        }
                        {...props}
                      >
                        {children}
                      </code>
                    );
                  },
                }}
              >
                {answer}
              </ReactMarkdown>
            </div>
          )}

          <div className="mt-5 flex flex-col gap-1 border-t border-zinc-100 pt-4 text-xs text-zinc-500 sm:flex-row sm:items-center sm:justify-between">
            <span>Модель: {model}</span>
            <span>request_id: {request_id}</span>
          </div>
        </>
      ) : (
        <div className="rounded-lg border border-dashed border-zinc-200 bg-zinc-50 px-4 py-10 text-center text-sm text-zinc-500">
          Ответ появится здесь после отправки вопроса.
        </div>
      )}
    </section>
  );
}
