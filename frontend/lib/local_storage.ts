const history_storage_key = "team_ai_assistant_history";
const history_limit = 5;


export function get_question_history(): string[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const value = window.localStorage.getItem(history_storage_key);

    if (!value) {
      return [];
    }

    const parsed_value = JSON.parse(value);

    if (!Array.isArray(parsed_value)) {
      return [];
    }

    return parsed_value
      .filter((item): item is string => typeof item === "string")
      .slice(0, history_limit);
  } catch {
    return [];
  }
}


export function save_question_history(history: string[]): void {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(
    history_storage_key,
    JSON.stringify(history.slice(0, history_limit)),
  );
}


export function add_question_to_history(question: string): string[] {
  const cleaned_question = question.trim();
  const current_history = get_question_history();

  if (!cleaned_question) {
    return current_history;
  }

  const next_history = [
    cleaned_question,
    ...current_history.filter((item) => item !== cleaned_question),
  ].slice(0, history_limit);

  save_question_history(next_history);
  return next_history;
}
