function normalize_latex_delimiters(value: string): string {
  return value
    .replace(/\\\[([\s\S]*?)\\\]/g, (_match, expression: string) => {
      return `$$${expression.trim()}$$`;
    })
    .replace(/\\\(([\s\S]*?)\\\)/g, (_match, expression: string) => {
      return `$${expression.trim()}$`;
    });
}


function normalize_parenthesized_latex(value: string): string {
  return value.replace(
    /\((\\(?:alpha|beta|gamma|delta|epsilon|theta|lambda|mu|pi|rho|sigma|tau|phi|chi|psi|omega|sqrt|frac|sum|prod|int|log|ln|sin|cos|tan|cdot|times|div|leq|geq|neq|approx|infty)[^)]*?)\)/g,
    (_match, expression: string) => {
      return `$${expression.trim()}$`;
    },
  );
}


export function normalize_math_markdown(value: string): string {
  return normalize_parenthesized_latex(normalize_latex_delimiters(value));
}
