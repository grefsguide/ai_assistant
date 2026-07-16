"use client";

import ReactMarkdown from "react-markdown";
import rehypeKatex from "rehype-katex";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import type { ReactNode } from "react";

import { get_plain_code_answer } from "@/lib/code_answer";
import { normalize_math_markdown } from "@/lib/math_markdown";
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
  const is_math_mode = mode === "math";
  const markdown_answer = is_math_mode ? normalize_math_markdown(answer) : answer;

  return (
    <section className="min-w-0 overflow-hidden rounded-lg border border-zinc-200 bg-white p-5 shadow-sm">
      <div className="mb-5 flex min-w-0 flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="min-w-0 text-lg font-semibold text-zinc-950">Ответ AI</h2>
        {actions}
      </div>

      {has_answer ? (
        <>
          {is_code_mode ? (
            <pre className="max-h-[70vh] max-w-full overflow-x-auto rounded-lg bg-zinc-950 p-4 text-sm leading-6 text-zinc-50 shadow-inner">
              <code className="font-mono">{get_plain_code_answer(answer)}</code>
            </pre>
          ) : (
            <div className="prose prose-zinc max-w-full break-words prose-headings:scroll-mt-20 prose-headings:text-zinc-950 prose-a:text-emerald-700 prose-pre:max-w-full prose-pre:overflow-x-auto prose-pre:rounded-lg prose-pre:bg-zinc-950 prose-pre:p-4 prose-pre:text-zinc-50">
              <ReactMarkdown
                remarkPlugins={is_math_mode ? [remarkGfm, remarkMath] : [remarkGfm]}
                rehypePlugins={is_math_mode ? [rehypeKatex] : []}
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
                {markdown_answer}
              </ReactMarkdown>
            </div>
          )}

          <div className="mt-5 flex min-w-0 flex-col gap-1 border-t border-zinc-100 pt-4 text-xs text-zinc-500 sm:flex-row sm:items-center sm:justify-between">
            <span className="min-w-0 break-all">Модель: {model}</span>
            <span className="min-w-0 break-all">request_id: {request_id}</span>
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
