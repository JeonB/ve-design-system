import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "../utils/cn";
import { BADGE_VARIANTS, badgeStyles, type BadgeSize, type BadgeVariant } from "./badge.css";

export type { BadgeSize, BadgeVariant };
export { BADGE_VARIANTS };

export type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  variant?: BadgeVariant;
  size?: BadgeSize;
  children: ReactNode;
};

/** 상태·카운트 등 비상호작용 표식. semantic color 토큰만 사용한다. */
export function Badge({
  variant = "neutral",
  size = "md",
  className,
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      {...props}
      className={cn(badgeStyles({ variant, size }), className)}
      data-size={size}
      data-slot="badge"
      data-variant={variant}
    >
      {children}
    </span>
  );
}
