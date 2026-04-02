import { AssistantHubShell } from "@/components/assistant-hub/AssistantHubShell";

export default function Home() {
  return (
    <AssistantHubShell landing>
      <h1 className="text-5xl font-bold tracking-tight text-[var(--theme-text)] sm:text-6xl md:text-7xl">
        AutoPilotX
      </h1>
    </AssistantHubShell>
  );
}
