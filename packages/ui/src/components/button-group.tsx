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

/**
 * 여러 Button을 그룹으로 배치한다.
 *
 * - `orientation`: 가로/세로 배치
 * - `attached`: 인접 버튼 border-radius·border 병합
 * - `gap`: attached가 아닐 때 버튼 간 간격
 */
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

/** attached ButtonGroup 내부 버튼 사이 시각적 구분선. */
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
