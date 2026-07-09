# AI-ассистент команды

MVP внутреннего AI-ассистента с frontend на Next.js/React/TypeScript/Tailwind CSS и backend на FastAPI/Pydantic/HTTPX. Backend хранит ключ OpenRouter в `.env` и проксирует запросы к LLM через OpenRouter.

## Возможности MVP

- ввод вопроса в большое controlled textarea;
- выбор режима ответа: общий, код или математика;
- отправка вопроса на `POST /api/v1/ask`;
- Markdown-отображение ответа с заголовками, списками, жирным текстом и кодовыми блоками;
- история последних 5 вопросов в `localStorage`;
- подстановка вопроса из истории обратно в поле ввода;
- копирование последнего ответа с состоянием `Скопировано`;
- состояния загрузки, ошибки и пустого ответа;
- адаптивный интерфейс для desktop и mobile.

## Backend

### Установка зависимостей

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

Для Windows PowerShell:

```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

### Настройка `.env`

```bash
cp .env.example .env
```

Заполните `OPENROUTER_API_KEY` реальным ключом OpenRouter:

```env
OPENROUTER_API_KEY=your_openrouter_api_key
OPENROUTER_BASE_URL=https://openrouter.ai/api/v1
OPENROUTER_MODEL=openai/gpt-5-chat
APP_NAME=team_ai_assistant
APP_URL=http://localhost:3000
REQUEST_TIMEOUT=60
```

Модель можно поменять без изменения кода: достаточно заменить `OPENROUTER_MODEL` в `backend/.env`.

### Запуск backend

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Healthcheck:

```bash
curl http://localhost:8000/health
```

### Тест endpoint

```bash
curl -X POST http://localhost:8000/api/v1/ask \
  -H "Content-Type: application/json" \
  -d '{"question":"Составь краткий план командного демо","mode":"general"}'
```

Для Windows PowerShell:

```powershell
curl.exe -X POST http://localhost:8000/api/v1/ask `
  -H "Content-Type: application/json" `
  -d "{\"question\":\"Составь краткий план командного демо\",\"mode\":\"general\"}"
```

Ответ:

```json
{
  "answer": "string",
  "model": "string",
  "request_id": "string"
}
```

Поле `mode` поддерживает значения `general`, `code` и `math`. Если поле не передано, backend использует `general`.

## Frontend

### Установка зависимостей

```bash
cd frontend
npm install
```

### Настройка `.env`

```bash
cp .env.example .env.local
```

По умолчанию frontend ожидает backend на `http://localhost:8000`:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
```

### Запуск frontend

```bash
npm run dev
```

Откройте [http://localhost:3000](http://localhost:3000).

## Локальный запуск всего проекта

В первом терминале:

```bash
cd backend
source .venv/bin/activate
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Во втором терминале:

```bash
cd frontend
npm run dev
```

Для Windows PowerShell backend-команда будет такой:

```powershell
cd backend
.\.venv\Scripts\Activate.ps1
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```
