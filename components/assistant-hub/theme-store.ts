export type ThemeMode = "dark" | "light";

function readStoredTheme(): ThemeMode {
  if (typeof window === "undefined") return "dark";
  const t = localStorage.getItem("autopilotx-theme");
  if (t === "light" || t === "dark") return t;
  return window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
}

let currentTheme: ThemeMode = "dark";
const listeners = new Set<() => void>();

function applyDom(theme: ThemeMode) {
  if (typeof document === "undefined") return;
  document.documentElement.setAttribute("data-theme", theme);
  document.documentElement.style.colorScheme = theme === "light" ? "light" : "dark";
}

function emit() {
  listeners.forEach((l) => l());
}

export function getThemeSnapshot(): ThemeMode {
  return currentTheme;
}

export function subscribeTheme(onChange: () => void): () => void {
  listeners.add(onChange);
  if (typeof window !== "undefined") {
    const t = readStoredTheme();
    if (t !== currentTheme) {
      currentTheme = t;
      applyDom(currentTheme);
      queueMicrotask(() => onChange());
    }
  }
  return () => listeners.delete(onChange);
}

export function setThemeMode(next: ThemeMode) {
  if (typeof window === "undefined") return;
  currentTheme = next;
  localStorage.setItem("autopilotx-theme", next);
  applyDom(next);
  emit();
}

export function toggleThemeMode() {
  setThemeMode(currentTheme === "dark" ? "light" : "dark");
}
