import { darkTheme, lightTheme, type ThemeMode } from "@ve/tokens";

export type ThemeScriptOptions = {
  storageKey?: string;
  defaultMode?: ThemeMode;
};

const MEDIA_QUERY = "(prefers-color-scheme: dark)";

/**
 * hydration 전에 실행할 테마 초기화 IIFE 문자열을 반환한다.
 * light/dark 클래스명은 @ve/tokens 빌드 결과로 인라인된다.
 */
export function getThemeInitScript({
  storageKey = "ve-theme",
  defaultMode = "system"
}: ThemeScriptOptions = {}): string {
  const light = JSON.stringify(lightTheme);
  const dark = JSON.stringify(darkTheme);
  const key = JSON.stringify(storageKey);
  const fallback = JSON.stringify(defaultMode);

  return `(function(){try{var s=${key},d=${fallback},l=${light},k=${dark},m=d,t;try{t=localStorage.getItem(s)}catch(e){}if(t==="light"||t==="dark"||t==="system")m=t;var r=m==="system"?(window.matchMedia&&window.matchMedia(${JSON.stringify(MEDIA_QUERY)}).matches?"dark":"light"):m;var e=document.documentElement;e.classList.remove(l,k);e.classList.add(r==="dark"?k:l);e.setAttribute("data-theme",r);e.style.colorScheme=r}catch(e){}})();`;
}

export type ThemeScriptProps = ThemeScriptOptions;

/**
 * FOUC 방지용 인라인 스크립트.
 * Next.js 등에서는 <head> 안 최상단에 배치한다.
 */
export function ThemeScript({ storageKey = "ve-theme", defaultMode = "system" }: ThemeScriptProps) {
  const script = getThemeInitScript({ storageKey, defaultMode });

  return (
    <script
      // hydration 전 동기 실행이 목적 — React가 이 스크립트를 재실행하지 않도록 suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: script }}
      suppressHydrationWarning
    />
  );
}
