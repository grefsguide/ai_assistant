import asyncio
import math
import time
from collections import defaultdict, deque
from collections.abc import Awaitable, Callable

from fastapi import Request, Response
from fastapi.responses import JSONResponse

from app.utils.request_id import create_request_id


class InMemoryRateLimiter:
    def __init__(self, max_requests: int, window_seconds: int) -> None:
        self.max_requests = max_requests
        self.window_seconds = window_seconds
        self._requests: defaultdict[str, deque[float]] = defaultdict(deque)
        self._lock = asyncio.Lock()

    async def get_retry_after(self, key: str) -> int | None:
        now = time.monotonic()
        window_start = now - self.window_seconds

        async with self._lock:
            request_times = self._requests[key]

            while request_times and request_times[0] <= window_start:
                request_times.popleft()

            if len(request_times) >= self.max_requests:
                retry_after = self.window_seconds - (now - request_times[0])
                return max(1, math.ceil(retry_after))

            request_times.append(now)
            return None


def get_client_key(request: Request) -> str:
    forwarded_for = request.headers.get("x-forwarded-for", "")
    client_ip = forwarded_for.split(",")[0].strip()

    if not client_ip and request.client:
        client_ip = request.client.host

    return client_ip or "unknown"


async def rate_limit_middleware(
    request: Request,
    call_next: Callable[[Request], Awaitable[Response]],
    limiter: InMemoryRateLimiter,
) -> Response:
    if request.method == "POST" and request.url.path == "/api/v1/ask":
        retry_after = await limiter.get_retry_after(get_client_key(request))

        if retry_after is not None:
            request_id = (
                getattr(request.state, "request_id", None)
                or request.headers.get("x-request-id")
                or create_request_id()
            )
            request.state.request_id = request_id

            return JSONResponse(
                status_code=429,
                content={
                    "detail": "Слишком много запросов. Подождите немного и попробуйте снова."
                },
                headers={
                    "Retry-After": str(retry_after),
                    **({"X-Request-ID": request_id} if request_id else {}),
                },
            )

    return await call_next(request)
