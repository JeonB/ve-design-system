import type { HTMLAttributes, ReactNode } from "react";
import { Children } from "react";
import { cn } from "../utils/cn";
import {
  buttonGroupAttachedHorizontal,
  buttonGroupAttachedVertical,
  buttonGroupRoot,
  buttonGroupSeparator
} from "./button-group.css";

export type ButtonGroupProps = HTMLAttributes<HTMLDivElement> & {
  orientation?: "horizontal" | "vertical";
  attached?: boolean;
  fullWidth?: boolean;
  gap?: "sm" | "md" | "none";
  children: ReactNode;
};

export function ButtonGroup({
  orientation = "horizontal",
  attached = false,
  fullWidth = false,
  gap = "sm",
  className,
  role = "group",
  children,
  ...props
}: ButtonGroupProps) {
  const resolvedGap = attached ? "none" : gap;
  const attachedClass =
    attached && orientation === "vertical"
      ? buttonGroupAttachedVertical
      : attached
        ? buttonGroupAttachedHorizontal
        : undefined;

  return (
    <div
      {...props}
      className={cn(
        buttonGroupRoot({
          orientation,
          fullWidth,
          gap: resolvedGap
        }),
        attachedClass,
        className
      )}
      data-attached={attached ? "true" : undefined}
      data-orientation={orientation}
      role={role}
    >
      {Children.map(children, (child) => child)}
    </div>
  );
}

export type ButtonGroupSeparatorProps = HTMLAttributes<HTMLSpanElement>;

export function ButtonGroupSeparator({ className, ...props }: ButtonGroupSeparatorProps) {
  return (
    <span
      {...props}
      aria-hidden="true"
      className={cn(buttonGroupSeparator, className)}
      role="separator"
    />
  );
}
