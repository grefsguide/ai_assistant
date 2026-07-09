import logging

from fastapi import APIRouter, HTTPException, Request

from app.schemas.chat_schema import AskRequest, AskResponse
from app.services.openrouter_client import (
    MissingApiKeyError,
    OpenRouterAPIError,
    OpenRouterClient,
    OpenRouterNetworkError,
    OpenRouterTimeoutError,
)
from app.utils.request_id import create_request_id


logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/v1", tags=["chat"])


@router.post("/ask", response_model=AskResponse)
async def ask_ai(payload: AskRequest, request: Request) -> AskResponse:
    request_id = getattr(request.state, "request_id", None) or create_request_id()
    client = OpenRouterClient()

    try:
        logger.info(
            "AI request started: request_id=%s mode=%s question_length=%s",
            request_id,
            payload.mode,
            len(payload.question),
        )
        result = await client.ask(payload.question, request_id, payload.mode)
    except MissingApiKeyError:
        logger.error("OpenRouter API key is missing: request_id=%s", request_id)
        raise HTTPException(
            status_code=500,
            detail="AI-сервис временно не настроен. Обратитесь к администратору.",
        ) from None
    except OpenRouterTimeoutError:
        raise HTTPException(
            status_code=504,
            detail="AI-сервис слишком долго отвечает. Попробуйте позже.",
        ) from None
    except OpenRouterNetworkError:
        raise HTTPException(
            status_code=503,
            detail="Не удалось связаться с AI-сервисом. Попробуйте позже.",
        ) from None
    except OpenRouterAPIError:
        raise HTTPException(
            status_code=502,
            detail="AI-сервис вернул ошибку. Попробуйте позже.",
        ) from None
    except Exception:
        logger.exception("Unexpected chat error: request_id=%s", request_id)
        raise HTTPException(
            status_code=500,
            detail="Произошла непредвиденная ошибка. Попробуйте позже.",
        ) from None

    logger.info(
        "AI request completed: request_id=%s mode=%s model=%s",
        request_id,
        payload.mode,
        result.model,
    )

    return AskResponse(
        answer=result.answer,
        model=result.model,
        request_id=request_id,
    )
