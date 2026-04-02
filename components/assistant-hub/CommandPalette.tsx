"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  BarChart3,
  Bell,
  FileUp,
  Mail,
  Mic,
  Search,
  Settings,
  Sparkles,
  Workflow,
} from "lucide-react";
import { cn } from "@/lib/utils";

export const COMMAND_PALETTE_EVENT = "autopilotx:command-palette";

const ACTIONS = [
  { id: "voice", label: "Voice Chat", hint: "Realtime voice agent", href: "/calling-agent", icon: Mic },
  { id: "email", label: "Email Manager", hint: "Inbox & compose", href: "/email", icon: Mail },
  { id: "docs", label: "Document Sender", hint: "Upload & dispatch", href: "/documents", icon: FileUp },
  { id: "flow", label: "Workflows", hint: "Automated tasks", href: "/workflows", icon: Workflow },
  { id: "notify", label: "Notifications", hint: "Alerts & mentions", href: "/notifications", icon: Bell },
  { id: "settings", label: "Settings", hint: "Preferences", href: "/settings", icon: Settings },
  { id: "analytics", label: "Analytics", hint: "Dashboard metrics", href: "/dashboard", icon: BarChart3 },
  { id: "agents", label: "Smart Assistants", hint: "Agent roster", href: "/agents", icon: Sparkles },
] as const;

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const router = useRouter();

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return [...ACTIONS];
    return ACTIONS.filter(
      (a) =>
        a.label.toLowerCase().includes(s) ||
        a.hint.toLowerCase().includes(s) ||
        a.id.includes(s)
    );
  }, [q]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      }
      if (e.key === "Escape") setOpen(false);
    };
    const onPalette = () => setOpen(true);
    window.addEventListener("keydown", onKey);
    window.addEventListener(COMMAND_PALETTE_EVENT, onPalette);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener(COMMAND_PALETTE_EVENT, onPalette);
    };
  }, []);

  const go = useCallback(
    (href: string) => {
      router.push(href);
      setOpen(false);
      setQ("");
    },
    [router]
  );

  if (!open) return null;

  return (
    <>
      <button
        type="button"
        className="animate-fade-in fixed inset-0 z-[200] bg-black/40 backdrop-blur-sm [html[data-theme=light]_&]:bg-slate-900/20"
        aria-label="Close command palette"
        onClick={() => setOpen(false)}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Command palette"
        className={cn(
          "animate-palette-in fixed left-1/2 top-[18%] z-[201] w-[min(100%,420px)] -translate-x-1/2",
          "rounded-2xl border border-white/15 bg-[var(--glass-panel)] p-3 shadow-2xl shadow-indigo-500/15 backdrop-blur-2xl",
          "[html[data-theme=light]_&]:border-slate-200/80 [html[data-theme=light]_&]:bg-white/85 [html[data-theme=light]_&]:shadow-slate-400/25"
        )}
      >
        <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-black/20 px-3 py-2 [html[data-theme=light]_&]:border-slate-200/60 [html[data-theme=light]_&]:bg-white/50">
          <Search className="h-4 w-4 shrink-0 text-[var(--theme-muted)]" />
          <input
            autoFocus
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Jump to module…"
            className="w-full bg-transparent text-sm text-[var(--theme-text)] placeholder:text-[var(--theme-muted)] focus:outline-none"
          />
          <kbd className="hidden rounded border border-white/15 bg-white/5 px-1.5 py-0.5 text-[10px] text-[var(--theme-muted)] sm:inline [html[data-theme=light]_&]:border-slate-300/60">
            Esc
          </kbd>
        </div>
        <ul className="mt-2 max-h-[min(60vh,320px)] overflow-y-auto py-1">
          {filtered.map((a) => (
            <li key={a.id}>
              <button
                type="button"
                onClick={() => go(a.href)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition-colors",
                  "hover:bg-white/10 [html[data-theme=light]_&]:hover:bg-indigo-500/10"
                )}
              >
                <a.icon className="h-4 w-4 shrink-0 text-[var(--orb-accent)]" />
                <span>
                  <span className="block font-medium text-[var(--theme-text)]">{a.label}</span>
                  <span className="text-xs text-[var(--theme-muted)]">{a.hint}</span>
                </span>
              </button>
            </li>
          ))}
          {filtered.length === 0 && (
            <li className="px-3 py-6 text-center text-sm text-[var(--theme-muted)]">No matches</li>
          )}
        </ul>
        <p className="border-t border-white/10 px-3 py-2 text-[10px] text-[var(--theme-muted)] [html[data-theme=light]_&]:border-slate-200/60">
          Tip: Press{" "}
          <kbd className="rounded border border-white/15 px-1 [html[data-theme=light]_&]:border-slate-300/60">
            ⌘K
          </kbd>{" "}
          /{" "}
          <kbd className="rounded border border-white/15 px-1 [html[data-theme=light]_&]:border-slate-300/60">
            Ctrl+K
          </kbd>{" "}
          anytime
        </p>
      </div>
    </>
  );
}

export function CommandPaletteTrigger({ className }: { className?: string }) {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event(COMMAND_PALETTE_EVENT))}
      className={cn(
        "rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-xs text-[var(--theme-muted)] backdrop-blur-md transition-colors hover:border-white/25 hover:text-[var(--theme-text)]",
        "[html[data-theme=light]_&]:border-slate-300/50 [html[data-theme=light]_&]:bg-white/60",
        className
      )}
    >
      Commands <kbd className="ml-1 rounded bg-black/20 px-1 [html[data-theme=light]_&]:bg-slate-200/80">⌘K</kbd>
    </button>
  );
}
