"use client";

import { useEffect, useState } from "react";

import { AnswerCard } from "@/components/answer_card";
import { CopyAnswerButton } from "@/components/copy_answer_button";
import { ErrorMessage } from "@/components/error_message";
import { LoadingState } from "@/components/loading_state";
import { QuestionInput } from "@/components/question_input";
import { RequestHistory } from "@/components/request_history";
import { ask_ai } from "@/lib/api_client";
import { get_plain_code_answer } from "@/lib/code_answer";
import { add_question_to_history, get_question_history } from "@/lib/local_storage";
import type { AssistantMode } from "@/types/chat_types";


const max_question_length = 5000;


export function AiAssistantPanel() {
  const [question, set_question] = useState("");
  const [answer, set_answer] = useState("");
  const [model, set_model] = useState("");
  const [request_id, set_request_id] = useState("");
  const [selected_mode, set_selected_mode] = useState<AssistantMode>("general");
  const [is_loading, set_is_loading] = useState(false);
  const [error, set_error] = useState("");
  const [can_retry, set_can_retry] = useState(false);
  const [history, set_history] = useState<string[]>([]);
  const [copied, set_copied] = useState(false);

  useEffect(() => {
    set_history(get_question_history());
  }, []);

  useEffect(() => {
    set_copied(false);
  }, [answer]);

  async function handle_submit() {
    const cleaned_question = question.trim();

    if (!cleaned_question) {
      set_error("Введите вопрос перед отправкой.");
      set_can_retry(false);
      return;
    }

    if (cleaned_question.length > max_question_length) {
      set_error("Вопрос слишком длинный. Максимум 5 000 символов.");
      set_can_retry(false);
      return;
    }

    set_is_loading(true);
    set_error("");
    set_can_retry(false);
    set_copied(false);

    try {
      const response = await ask_ai(cleaned_question, selected_mode);

      set_answer(response.answer);
      set_model(response.model);
      set_request_id(response.request_id);
      set_history(add_question_to_history(cleaned_question));
      set_can_retry(false);
    } catch (caught_error) {
      set_answer("");
      set_model("");
      set_request_id("");
      set_can_retry(true);
      set_error(
        caught_error instanceof Error
          ? caught_error.message
          : "Не удалось получить ответ. Попробуйте позже.",
      );
    } finally {
      set_is_loading(false);
    }
  }

  function handle_select_question(selected_question: string) {
    set_question(selected_question);
    set_error("");
    set_can_retry(false);
  }

  function handle_mode_change(next_mode: AssistantMode) {
    set_selected_mode(next_mode);
    set_error("");
    set_can_retry(false);
  }

  async function handle_copy_answer() {
    if (!answer.trim()) {
      return;
    }

    try {
      const copied_answer =
        selected_mode === "code" ? get_plain_code_answer(answer) : answer;

      await navigator.clipboard.writeText(copied_answer);
      set_copied(true);
      window.setTimeout(() => set_copied(false), 1800);
    } catch {
      set_error("Не удалось скопировать ответ. Попробуйте вручную выделить текст.");
      set_can_retry(false);
    }
  }

  return (
    <section className="grid gap-6 lg:grid-cols-[minmax(0,1.35fr)_minmax(280px,0.65fr)]">
      <div className="space-y-5">
        <div className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm">
          <QuestionInput
            question={question}
            selected_mode={selected_mode}
            is_loading={is_loading}
            max_length={max_question_length}
            on_question_change={set_question}
            on_mode_change={handle_mode_change}
            on_submit={handle_submit}
          />
        </div>

        <ErrorMessage
          message={error}
          action_label={can_retry ? "Повторить запрос" : undefined}
          is_action_disabled={is_loading}
          on_action={can_retry ? handle_submit : undefined}
        />

        {is_loading ? (
          <LoadingState />
        ) : (
          <AnswerCard
            answer={answer}
            model={model}
            request_id={request_id}
            mode={selected_mode}
            actions={
              <CopyAnswerButton
                answer={answer}
                copied={copied}
                on_copy={handle_copy_answer}
              />
            }
          />
        )}
      </div>

      <RequestHistory
        history={history}
        on_select_question={handle_select_question}
      />
    </section>
  );
}
