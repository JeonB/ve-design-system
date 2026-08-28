import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode
} from "react";
import { darkTheme, lightTheme, type ResolvedTheme, type ThemeMode } from "@ve/tokens";

export type { ResolvedTheme, ThemeMode };

type ThemeContextValue = {
  mode: ThemeMode;
  resolvedTheme: ResolvedTheme;
  setMode: (mode: ThemeMode) => void;
  toggle: () => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

const MEDIA_QUERY = "(prefers-color-scheme: dark)";

function getSystemTheme(): ResolvedTheme {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
    return "light";
  }

  return window.matchMedia(MEDIA_QUERY).matches ? "dark" : "light";
}

function readStoredMode(storageKey: string, fallback: ThemeMode): ThemeMode {
  if (typeof window === "undefined") {
    return fallback;
  }

  try {
    const stored = window.localStorage.getItem(storageKey);
    if (stored === "light" || stored === "dark" || stored === "system") {
      return stored;
    }
  } catch {
    // private mode 등 storage 접근 실패 시 기본값 사용
  }

  return fallback;
}

function resolveTheme(mode: ThemeMode, systemTheme: ResolvedTheme): ResolvedTheme {
  return mode === "system" ? systemTheme : mode;
}

function applyThemeClass(resolved: ResolvedTheme) {
  if (typeof document === "undefined") {
    return;
  }

  const root = document.documentElement;
  root.classList.remove(lightTheme, darkTheme);
  root.classList.add(resolved === "dark" ? darkTheme : lightTheme);
  root.setAttribute("data-theme", resolved);
  root.style.colorScheme = resolved;
}

export type ThemeProviderProps = {
  children: ReactNode;
  defaultMode?: ThemeMode;
  storageKey?: string;
  /** Storybook 등에서 storage·system을 무시하고 고정한다. */
  forcedMode?: ResolvedTheme;
};

/**
 * documentElement에 light/dark 테마 클래스를 적용한다.
 * mode가 system이면 prefers-color-scheme을 따른다.
 */
export function ThemeProvider({
  children,
  defaultMode = "system",
  storageKey = "ve-theme",
  forcedMode
}: ThemeProviderProps) {
  const [mode, setModeState] = useState<ThemeMode>(() =>
    forcedMode ? forcedMode : readStoredMode(storageKey, defaultMode)
  );
  const [systemTheme, setSystemTheme] = useState<ResolvedTheme>(() => getSystemTheme());

  const resolvedTheme: ResolvedTheme = forcedMode ?? resolveTheme(mode, systemTheme);

  useEffect(() => {
    if (forcedMode) {
      return;
    }

    const media = window.matchMedia(MEDIA_QUERY);
    const onChange = () => setSystemTheme(media.matches ? "dark" : "light");

    onChange();
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, [forcedMode]);

  useEffect(() => {
    applyThemeClass(resolvedTheme);
  }, [resolvedTheme]);

  const setMode = useCallback(
    (next: ThemeMode) => {
      if (forcedMode) {
        return;
      }

      setModeState(next);

      try {
        window.localStorage.setItem(storageKey, next);
      } catch {
        // ignore
      }
    },
    [forcedMode, storageKey]
  );

  const toggle = useCallback(() => {
    const next: ResolvedTheme = resolvedTheme === "dark" ? "light" : "dark";
    setMode(next);
  }, [resolvedTheme, setMode]);

  const value = useMemo<ThemeContextValue>(
    () => ({
      mode: forcedMode ?? mode,
      resolvedTheme,
      setMode,
      toggle
    }),
    [forcedMode, mode, resolvedTheme, setMode, toggle]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

/** ThemeProvider 하위에서 현재 모드와 전환 API를 반환한다. */
export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("[@ve/ui ThemeProvider] useTheme는 ThemeProvider 안에서만 사용할 수 있습니다.");
  }

  return context;
}

export { resolveTheme, applyThemeClass, getSystemTheme };
