"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { ComponentType } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  BarChart3,
  Bell,
  FileUp,
  Mail,
  Mic,
  Search,
  Settings,
  Workflow,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { COMMAND_PALETTE_EVENT } from "./CommandPalette";

const R = 128;
const ORB = 72;

type Item = {
  id: string;
  label: string;
  href: string;
  icon: ComponentType<{ className?: string }>;
  isPalette?: boolean;
};

const ITEMS: Item[] = [
  { id: "voice", label: "Voice Chat", href: "/calling-agent", icon: Mic },
  { id: "email", label: "Email", href: "/email", icon: Mail },
  { id: "docs", label: "Documents", href: "/documents", icon: FileUp },
  { id: "flow", label: "Workflows", href: "/workflows", icon: Workflow },
  { id: "notify", label: "Alerts", href: "/notifications", icon: Bell },
  { id: "settings", label: "Settings", href: "/settings", icon: Settings },
  { id: "search", label: "Search", href: "#palette", icon: Search, isPalette: true },
  { id: "analytics", label: "Analytics", href: "/dashboard", icon: BarChart3 },
];

function angleForIndex(i: number, n: number) {
  return (i / n) * Math.PI * 2 - Math.PI / 2;
}

function posForIndex(i: number, n: number, radius: number) {
  const a = angleForIndex(i, n);
  return { x: Math.cos(a) * radius, y: Math.sin(a) * radius };
}

function angleFromPointer(cx: number, cy: number, px: number, py: number) {
  return Math.atan2(py - cy, px - cx);
}

export function RadialAssistOrb() {
  const router = useRouter();
  const pathname = usePathname();
  /** Home = centered bottom; any other route = dock bottom-right after navigation */
  const docked = pathname !== "/";
  const [expanded, setExpanded] = useState(false);
  const [hoverExpand, setHoverExpand] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [highlight, setHighlight] = useState<number | null>(null);
  const highlightRef = useRef<number | null>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const n = ITEMS.length;

  const show = expanded || hoverExpand;

  const openPalette = useCallback(() => {
    window.dispatchEvent(new Event(COMMAND_PALETTE_EVENT));
  }, []);

  const navigateItem = useCallback(
    (item: Item) => {
      if (item.isPalette) {
        openPalette();
        return;
      }
      router.push(item.href);
      setExpanded(false);
      setHoverExpand(false);
    },
    [openPalette, router]
  );

  const onPointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!show || !wrapRef.current) return;
      if ((e.target as HTMLElement).closest("button")) return;
      const rect = wrapRef.current.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.hypot(dx, dy);
      if (dist < ORB / 2 + 24) return;
      if (dist > rect.width / 2 - 4) return;
      e.currentTarget.setPointerCapture(e.pointerId);
      setDragging(true);
      const ang = angleFromPointer(cx, cy, e.clientX, e.clientY);
      let best = 0;
      let bestDiff = Infinity;
      for (let i = 0; i < n; i++) {
        const ia = angleForIndex(i, n);
        let diff = Math.abs(ang - ia);
        if (diff > Math.PI) diff = Math.PI * 2 - diff;
        if (diff < bestDiff) {
          bestDiff = diff;
          best = i;
        }
      }
      highlightRef.current = best;
      setHighlight(best);
    },
    [show, n]
  );

  const onPointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!dragging || !wrapRef.current) return;
      const rect = wrapRef.current.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const ang = angleFromPointer(cx, cy, e.clientX, e.clientY);
      let best = 0;
      let bestDiff = Infinity;
      for (let i = 0; i < n; i++) {
        const ia = angleForIndex(i, n);
        let diff = Math.abs(ang - ia);
        if (diff > Math.PI) diff = Math.PI * 2 - diff;
        if (diff < bestDiff) {
          bestDiff = diff;
          best = i;
        }
      }
      highlightRef.current = best;
      setHighlight(best);
    },
    [dragging, n]
  );

  const onPointerUp = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!dragging) return;
      try {
        e.currentTarget.releasePointerCapture(e.pointerId);
      } catch {
        /* ignore */
      }
      setDragging(false);
      const h = highlightRef.current;
      highlightRef.current = null;
      if (h !== null) {
        navigateItem(ITEMS[h]);
      }
      setHighlight(null);
    },
    [dragging, navigateItem]
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setExpanded(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const ringItems = useMemo(
    () =>
      ITEMS.map((item, i) => {
        const { x, y } = posForIndex(i, n, R);
        return { item, x, y, i };
      }),
    [n]
  );

  return (
    <nav
      className={cn(
        "pointer-events-none fixed z-50 transition-[bottom,right,left,padding] duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] will-change-[bottom,right]",
        docked
          ? "bottom-6 right-6 flex w-auto justify-end pb-0 pt-0"
          : "bottom-0 left-0 right-0 flex justify-center pb-8 pt-24"
      )}
      aria-label="Assistant navigation"
    >
      <div
        ref={wrapRef}
        className={cn(
          "pointer-events-auto relative flex h-[340px] w-[340px] items-center justify-center transition-transform duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]",
          docked && "scale-[0.92] sm:scale-95"
        )}
        onMouseEnter={() => setHoverExpand(true)}
        onMouseLeave={() => {
          setHoverExpand(false);
          setHighlight(null);
          highlightRef.current = null;
          setDragging(false);
        }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        {show && (
          <div
            className={cn(
              "animate-radial-ring-in absolute inset-0 rounded-full border border-white/10 bg-[var(--glass-panel)] shadow-2xl backdrop-blur-2xl",
              "[html[data-theme=light]_&]:border-slate-200/70 [html[data-theme=light]_&]:bg-gradient-to-br [html[data-theme=light]_&]:from-white/75 [html[data-theme=light]_&]:to-indigo-50/50"
            )}
            style={{
              background:
                "radial-gradient(circle at 30% 25%, rgba(99,102,241,0.15), transparent 55%), radial-gradient(circle at 70% 80%, rgba(168,85,247,0.12), transparent 50%)",
            }}
          />
        )}

        {show &&
          ringItems.map(({ item, x, y, i }) => {
            const active = highlight === i;
            return (
              <button
                type="button"
                key={item.id}
                onPointerDown={(e) => e.stopPropagation()}
                onClick={(e) => {
                  e.stopPropagation();
                  navigateItem(item);
                }}
                className={cn(
                  "group absolute z-20 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-2xl border text-[var(--theme-text)] shadow-lg transition-all duration-200",
                  "border-white/15 bg-white/10 hover:scale-105 hover:border-[var(--orb-accent)] hover:bg-white/15 active:scale-95",
                  "[html[data-theme=light]_&]:border-slate-200/80 [html[data-theme=light]_&]:bg-white/80 [html[data-theme=light]_&]:shadow-slate-400/25",
                  active && "border-[var(--orb-accent)] bg-[var(--orb-accent-muted)] ring-2 ring-[var(--orb-accent)]/40"
                )}
                style={{
                  left: `calc(50% + ${x}px)`,
                  top: `calc(50% + ${y}px)`,
                  animationDelay: `${i * 35}ms`,
                }}
              >
                <item.icon className="h-6 w-6 text-[var(--orb-accent)]" />
                <span
                  className={cn(
                    "pointer-events-none absolute -top-9 left-1/2 z-30 -translate-x-1/2 whitespace-nowrap rounded-full border border-white/10 bg-black/50 px-2 py-0.5 text-[10px] font-medium text-white/90 opacity-0 shadow-lg backdrop-blur-md transition-opacity group-hover:opacity-100",
                    "[html[data-theme=light]_&]:border-slate-200/60 [html[data-theme=light]_&]:bg-white/90 [html[data-theme=light]_&]:text-slate-800",
                    active && "opacity-100"
                  )}
                >
                  {item.label}
                </span>
              </button>
            );
          })}

        <button
          type="button"
          onPointerDown={(e) => e.stopPropagation()}
          onClick={(e) => {
            e.stopPropagation();
            setExpanded((v) => !v);
          }}
          className={cn(
            "animate-orb-glow relative z-10 flex items-center justify-center rounded-full transition-transform duration-200",
            "border border-white/20 bg-gradient-to-br from-indigo-500/30 via-purple-500/25 to-cyan-500/20 backdrop-blur-xl",
            "hover:scale-105 active:scale-[0.97]",
            "[html[data-theme=light]_&]:border-slate-200/80 [html[data-theme=light]_&]:from-sky-100/90 [html[data-theme=light]_&]:via-indigo-100/80 [html[data-theme=light]_&]:to-violet-100/70 [html[data-theme=light]_&]:shadow-indigo-300/40"
          )}
          aria-expanded={show}
          aria-label="Open assistant menu"
          style={{ width: ORB, height: ORB }}
        >
          <span className="absolute inset-2 rounded-full bg-gradient-to-tr from-white/25 to-transparent opacity-60 [html[data-theme=light]_&]:from-white/60" />
          <span className="relative text-xs font-semibold uppercase tracking-[0.2em] text-white/90 [html[data-theme=light]_&]:text-indigo-900/80">
            AI
          </span>
        </button>

        {!docked && (
          <p className="pointer-events-none absolute bottom-0 text-center text-[10px] text-[var(--theme-muted)]">
            Tap orb · Hover to expand · Drag ring to select
          </p>
        )}
      </div>
    </nav>
  );
}
