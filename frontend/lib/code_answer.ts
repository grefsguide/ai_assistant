export function get_plain_code_answer(answer: string): string {
  const trimmed_answer = answer.trim();
  const fenced_code_match = trimmed_answer.match(
    /^```(?:[\w.+-]+)?\s*\n([\s\S]*?)\n```$/,
  );

  return fenced_code_match?.[1].trimEnd() ?? answer;
}
