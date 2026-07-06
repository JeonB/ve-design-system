import { Children } from "react";
import { cn } from "../utils/cn";
import {
  buttonGroupAttachedHorizontal,
  buttonGroupAttachedVertical,
  buttonGroupRoot,
  buttonGroupSeparator
} from "./button-group.css";

/**
 * @param {object} props
 * @param {"horizontal"|"vertical"} [props.orientation]
 * @param {boolean} [props.attached]
 * @param {boolean} [props.fullWidth]
 * @param {"sm"|"md"|"none"} [props.gap]
 * @param {string} [props.className]
 * @param {string} [props.role]
 * @param {import('react').ReactNode} props.children
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
}) {
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

export function ButtonGroupSeparator({ className, ...props }) {
  return (
    <span
      {...props}
      aria-hidden="true"
      className={cn(buttonGroupSeparator, className)}
      role="separator"
    />
  );
}
