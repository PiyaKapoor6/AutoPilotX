import { AssistantHubShell } from '@/components/assistant-hub/AssistantHubShell';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AssistantHubShell>{children}</AssistantHubShell>;
}
