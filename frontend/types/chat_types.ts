export type AssistantMode = "general" | "code" | "math";

export interface AskRequest {
  question: string;
  mode: AssistantMode;
}

export interface AskResponse {
  answer: string;
  model: string;
  request_id: string;
}

export interface ApiErrorResponse {
  detail?: string;
}
