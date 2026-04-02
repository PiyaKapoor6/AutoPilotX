"use client";

import { Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ThemeMode } from "./theme-store";

export function ThemeToggle({
  theme,
  onToggle,
  className,
}: {
  theme: ThemeMode;
  onToggle: () => void;
  className?: string;
}) {
  const isLight = theme === "light";

  return (
    <button
      type="button"
      onClick={onToggle}
      className={cn(
        "relative z-[100] flex h-11 w-11 items-center justify-center rounded-full",
        "border backdrop-blur-xl transition-all duration-200",
        "border-white/15 bg-white/5 shadow-lg shadow-indigo-500/10",
        "hover:scale-105 hover:border-white/25 hover:shadow-indigo-500/25",
        "active:scale-95",
        "focus-visible:ring-2 focus-visible:ring-[var(--orb-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--theme-background)]",
        "[html[data-theme=light]_&]:border-slate-300/50 [html[data-theme=light]_&]:bg-white/70 [html[data-theme=light]_&]:shadow-slate-400/20",
        className
      )}
      aria-label={isLight ? "Switch to dark mode" : "Switch to light mode"}
    >
      <span className="text-[var(--theme-text)] transition-transform duration-300">
        {isLight ? (
          <Sun className="h-5 w-5 text-amber-500" />
        ) : (
          <Moon className="h-5 w-5 text-indigo-300" />
        )}
      </span>
    </button>
  );
}
