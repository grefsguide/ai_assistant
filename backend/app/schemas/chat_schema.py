from pydantic import BaseModel, Field, field_validator

from app.core.system_prompts import AssistantMode


class AskRequest(BaseModel):
    question: str = Field(..., max_length=5000)
    mode: AssistantMode = Field(default=AssistantMode.general)

    @field_validator("question")
    @classmethod
    def validate_question(cls, value: str) -> str:
        cleaned_value = value.strip()

        if not cleaned_value:
            raise ValueError("Вопрос не может быть пустым.")

        return cleaned_value


class AskResponse(BaseModel):
    answer: str
    model: str
    request_id: str
