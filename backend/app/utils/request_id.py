from uuid import uuid4


def create_request_id() -> str:
    return str(uuid4())
