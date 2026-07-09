import type {
  ApiErrorResponse,
  AskRequest,
  AskResponse,
  AssistantMode,
} from "@/types/chat_types";


const api_base_url = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";


class AssistantApiError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AssistantApiError";
  }
}


function get_error_message(data: unknown): string {
  if (
    typeof data === "object" &&
    data !== null &&
    "detail" in data &&
    typeof (data as ApiErrorResponse).detail === "string"
  ) {
    return (data as ApiErrorResponse).detail ?? "Не удалось получить ответ. Попробуйте позже.";
  }

  return "Не удалось получить ответ. Попробуйте позже.";
}


async function parse_response(response: Response): Promise<unknown> {
  try {
    return await response.json();
  } catch {
    return null;
  }
}


export async function ask_ai(
  question: string,
  mode: AssistantMode,
): Promise<AskResponse> {
  const request_body: AskRequest = { question, mode };

  try {
    const response = await fetch(`${api_base_url}/api/v1/ask`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request_body),
    });

    const data = await parse_response(response);

    if (!response.ok) {
      throw new AssistantApiError(get_error_message(data));
    }

    if (
      typeof data !== "object" ||
      data === null ||
      !("answer" in data) ||
      !("model" in data) ||
      !("request_id" in data)
    ) {
      throw new AssistantApiError("Backend вернул некорректный ответ.");
    }

    return data as AskResponse;
  } catch (error) {
    if (error instanceof AssistantApiError) {
      throw error;
    }

    throw new Error("Не удалось связаться с backend. Проверьте, что сервер запущен.");
  }
}
