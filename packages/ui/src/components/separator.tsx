import type { HTMLAttributes } from "react";
import { cn } from "../utils/cn";
import { separatorStyles, type SeparatorOrientation } from "./separator.css";

export type { SeparatorOrientation };

export type SeparatorProps = HTMLAttributes<HTMLDivElement> & {
  orientation?: SeparatorOrientation;
  decorative?: boolean;
};

/** 시각적 구분선. decorative면 보조 기술에서 숨긴다. */
export function Separator({
  orientation = "horizontal",
  decorative = true,
  className,
  ...props
}: SeparatorProps) {
  return (
    <div
      {...props}
      aria-hidden={decorative ? true : undefined}
      aria-orientation={decorative ? undefined : orientation}
      className={cn(separatorStyles({ orientation }), className)}
      data-orientation={orientation}
      data-slot="separator"
      role={decorative ? "none" : "separator"}
    />
  );
}
