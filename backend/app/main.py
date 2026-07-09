import logging

from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from starlette.exceptions import HTTPException as StarletteHTTPException

from app.api.v1.chat_router import router as chat_router
from app.core.config import get_settings


logger = logging.getLogger(__name__)
settings = get_settings()

app = FastAPI(title=settings.app_name, version="0.1.0")

allowed_origins = list(
    dict.fromkeys(
        [
            settings.app_url,
            "http://localhost:3000",
            "http://127.0.0.1:3000",
        ]
    )
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(chat_router)


@app.get("/health")
async def health_check() -> dict[str, str]:
    return {"status": "ok"}


def _get_validation_message(exc: RequestValidationError) -> str:
    for error in exc.errors():
        location = error.get("loc", [])
        error_type = error.get("type", "")
        context = error.get("ctx", {})
        message = error.get("msg", "")

        if location and location[-1] == "question":
            if error_type == "missing":
                return "Поле question обязательно."
            if error_type == "string_type":
                return "Поле question должно быть строкой."
            if error_type == "string_too_long":
                return "Вопрос слишком длинный. Максимум 5 000 символов."
            if error_type == "value_error":
                return str(context.get("error") or message).replace("Value error, ", "")

        if location and location[-1] == "mode":
            return "Режим должен быть одним из: general, code, math."

    return "Некорректный запрос. Проверьте данные и попробуйте снова."


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(
    request: Request,
    exc: RequestValidationError,
) -> JSONResponse:
    return JSONResponse(
        status_code=422,
        content={"detail": _get_validation_message(exc)},
    )


@app.exception_handler(StarletteHTTPException)
async def http_exception_handler(
    request: Request,
    exc: StarletteHTTPException,
) -> JSONResponse:
    detail = exc.detail if isinstance(exc.detail, str) else "Ошибка запроса."
    return JSONResponse(status_code=exc.status_code, content={"detail": detail})


@app.exception_handler(Exception)
async def unexpected_exception_handler(
    request: Request,
    exc: Exception,
) -> JSONResponse:
    logger.exception("Unexpected backend error")
    return JSONResponse(
        status_code=500,
        content={"detail": "Произошла непредвиденная ошибка. Попробуйте позже."},
    )
