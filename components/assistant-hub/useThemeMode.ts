"use client";

import { useCallback, useSyncExternalStore } from "react";
import {
  getThemeSnapshot,
  subscribeTheme,
  toggleThemeMode,
  type ThemeMode,
} from "./theme-store";

export type { ThemeMode };

export function useThemeMode() {
  const theme = useSyncExternalStore(
    subscribeTheme,
    getThemeSnapshot,
    (): ThemeMode => "dark"
  );

  const toggle = useCallback(() => {
    toggleThemeMode();
  }, []);

  return { theme, toggle };
}
