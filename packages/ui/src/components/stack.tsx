import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "../utils/cn";
import {
  stackStyles,
  type StackAlign,
  type StackDirection,
  type StackGap,
  type StackJustify
} from "./stack.css";

export type { StackAlign, StackDirection, StackGap, StackJustify };

export type StackProps = HTMLAttributes<HTMLDivElement> & {
  direction?: StackDirection;
  gap?: StackGap;
  align?: StackAlign;
  justify?: StackJustify;
  wrap?: boolean;
  fullWidth?: boolean;
  children: ReactNode;
};

/** flex 간격 레이아웃. gap/direction으로 Card·폼 본문 배치를 통일한다. */
export function Stack({
  direction = "vertical",
  gap = "md",
  align = "stretch",
  justify = "start",
  wrap = false,
  fullWidth = false,
  className,
  children,
  ...props
}: StackProps) {
  return (
    <div
      {...props}
      className={cn(
        stackStyles({ direction, gap, align, justify, wrap, fullWidth }),
        className
      )}
      data-direction={direction}
      data-gap={gap}
      data-slot="stack"
    >
      {children}
    </div>
  );
}
