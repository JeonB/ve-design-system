import { Button } from "../components/button";
import { useTheme } from "./theme-provider";

export type ThemeToggleProps = {
  className?: string;
};

/** light ↔ dark 전환 버튼. system 모드에서는 resolved 반대 모드로 고정한다. */
export function ThemeToggle({ className }: ThemeToggleProps) {
  const { resolvedTheme, toggle } = useTheme();

  return (
    <Button
      aria-label={resolvedTheme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
      className={className}
      onClick={toggle}
      size="sm"
      type="button"
      variant="outline"
    >
      {resolvedTheme === "dark" ? "Light" : "Dark"}
    </Button>
  );
}
