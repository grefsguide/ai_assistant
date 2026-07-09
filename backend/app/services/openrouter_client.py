import logging
from dataclasses import dataclass
from typing import Any

import httpx

from app.core.config import Settings, get_settings
from app.core.system_prompts import AssistantMode, get_system_prompt


logger = logging.getLogger(__name__)


class MissingApiKeyError(Exception):
    pass


class OpenRouterAPIError(Exception):
    pass


class OpenRouterNetworkError(Exception):
    pass


class OpenRouterTimeoutError(Exception):
    pass


@dataclass(frozen=True)
class OpenRouterAnswer:
    answer: str
    model: str


class OpenRouterClient:
    def __init__(self, settings: Settings | None = None) -> None:
        self.settings = settings or get_settings()

    async def ask(
        self,
        question: str,
        request_id: str,
        mode: AssistantMode,
    ) -> OpenRouterAnswer:
        if not self.settings.openrouter_api_key.strip():
            raise MissingApiKeyError("OpenRouter API key is not configured.")

        payload = {
            "model": self.settings.openrouter_model,
            "messages": [
                {"role": "system", "content": get_system_prompt(mode)},
                {"role": "user", "content": question},
            ],
            "temperature": 0.2,
        }

        headers = {
            "Authorization": f"Bearer {self.settings.openrouter_api_key}",
            "Content-Type": "application/json",
            "HTTP-Referer": self.settings.app_url,
            "X-Title": self.settings.app_name,
            "X-Request-ID": request_id,
        }

        try:
            async with httpx.AsyncClient(
                base_url=self.settings.openrouter_base_url.rstrip("/"),
                timeout=self.settings.request_timeout,
            ) as client:
                response = await client.post(
                    "/chat/completions",
                    headers=headers,
                    json=payload,
                )

            if response.status_code >= 400:
                logger.warning(
                    "OpenRouter returned an error: status=%s request_id=%s body=%s",
                    response.status_code,
                    request_id,
                    response.text[:1000],
                )
                raise OpenRouterAPIError("OpenRouter request failed.")

            data = response.json()

        except httpx.TimeoutException as exc:
            logger.warning("OpenRouter timeout: request_id=%s", request_id)
            raise OpenRouterTimeoutError("OpenRouter request timed out.") from exc
        except httpx.RequestError as exc:
            logger.warning(
                "OpenRouter network error: request_id=%s error=%s",
                request_id,
                exc,
            )
            raise OpenRouterNetworkError("OpenRouter network error.") from exc
        except ValueError as exc:
            logger.warning("OpenRouter returned invalid JSON: request_id=%s", request_id)
            raise OpenRouterAPIError("OpenRouter returned invalid JSON.") from exc

        answer = self._extract_answer(data)
        model = str(data.get("model") or self.settings.openrouter_model)

        if not answer:
            logger.warning("OpenRouter returned an empty answer: request_id=%s", request_id)
            raise OpenRouterAPIError("OpenRouter returned an empty answer.")

        return OpenRouterAnswer(answer=answer, model=model)

    def _extract_answer(self, data: dict[str, Any]) -> str:
        choices = data.get("choices")

        if not isinstance(choices, list) or not choices:
            return ""

        first_choice = choices[0]
        if not isinstance(first_choice, dict):
            return ""

        message = first_choice.get("message")
        if not isinstance(message, dict):
            return ""

        content = message.get("content")

        if isinstance(content, str):
            return content.strip()

        if isinstance(content, list):
            text_parts = [
                item.get("text", "")
                for item in content
                if isinstance(item, dict) and isinstance(item.get("text"), str)
            ]
            return "\n".join(text_parts).strip()

        return ""
