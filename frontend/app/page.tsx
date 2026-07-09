import { AiAssistantPanel } from "@/components/ai_assistant_panel";


export default function Home() {
  return (
    <main className="min-h-screen bg-[#f7f7f4] px-4 py-6 text-zinc-950 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8">
        <header className="border-b border-zinc-200 pb-6">
          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.12em] text-emerald-700">
            Internal AI
          </p>
          <h1 className="text-3xl font-bold tracking-normal text-zinc-950 sm:text-4xl">
            AI-ассистент команды
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-zinc-600">
            Помогает быстро получить структурированный ответ, собрать идеи,
            уточнить план действий и подготовить рабочие материалы.
          </p>
        </header>

        <AiAssistantPanel />
      </div>
    </main>
  );
}
