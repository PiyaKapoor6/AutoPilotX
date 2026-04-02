"use client";

import { cn } from "@/lib/utils";
import { ThemeToggle } from "./ThemeToggle";
import { CommandPalette, CommandPaletteTrigger } from "./CommandPalette";
import { RadialAssistOrb } from "./RadialAssistOrb";
import { useThemeMode } from "./useThemeMode";

export function AssistantHubShell({
  children,
  landing = false,
}: {
  children: React.ReactNode;
  /** Minimal hero: centered title only; orb + chrome unchanged */
  landing?: boolean;
}) {
  const { theme, toggle } = useThemeMode();

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-[var(--theme-background)] text-[var(--theme-text)]">
      <div
        className="pointer-events-none fixed inset-0 opacity-100"
        aria-hidden
        style={{
          background:
            theme === "dark"
              ? "radial-gradient(ellipse 120% 80% at 50% -20%, rgba(99,102,241,0.18), transparent 50%), radial-gradient(ellipse 80% 50% at 100% 100%, rgba(168,85,247,0.12), transparent 45%), var(--theme-background)"
              : "radial-gradient(ellipse 100% 65% at 50% -15%, rgba(148,163,184,0.35), transparent 52%), radial-gradient(ellipse 70% 45% at 95% 5%, rgba(165,180,252,0.22), transparent 48%), var(--theme-background)",
        }}
      />

      <div className="pointer-events-none fixed inset-0 bg-[url('data:image/svg+xml,%3Csvg viewBox=%220 0 256 256%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22n%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.8%22 numOctaves=%224%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23n)%22 opacity=%220.03%22/%3E%3C/svg%3E')] opacity-[0.35] [html[data-theme=light]_&]:opacity-[0.12]" />

      <header className="fixed right-4 top-4 z-[100] flex items-center gap-2">
        <CommandPaletteTrigger />
        <ThemeToggle theme={theme} onToggle={toggle} />
      </header>

      <main
        className={cn(
          "relative z-10 w-full flex-1",
          landing
            ? "flex flex-col items-center justify-center px-6 pb-40 pt-16"
            : "mx-auto max-w-6xl px-6 pb-44 pt-20"
        )}
      >
        {children}
      </main>

      <CommandPalette />
      <RadialAssistOrb />
    </div>
  );
}
