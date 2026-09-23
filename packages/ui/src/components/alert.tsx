import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "../utils/cn";
import {
  ALERT_VARIANTS,
  alertDescription,
  alertStyles,
  alertTitle,
  alertTitleTone,
  type AlertVariant
} from "./alert.css";

export type { AlertVariant };
export { ALERT_VARIANTS };

export type AlertProps = HTMLAttributes<HTMLDivElement> & {
  variant?: AlertVariant;
  title?: ReactNode;
  children?: ReactNode;
};

function defaultRole(variant: AlertVariant): "status" | "alert" {
  switch (variant) {
    case "warning":
    case "danger":
      return "alert";
    case "neutral":
    case "info":
    case "success":
      return "status";
    default: {
      const _exhaustive: never = variant;
      return _exhaustive;
    }
  }
}

/** 인라인 상태 배너. Toast와 달리 화면에 유지되는 피드백이다. */
export function Alert({
  variant = "neutral",
  title,
  children,
  className,
  role,
  ...props
}: AlertProps) {
  return (
    <div
      {...props}
      className={cn(alertStyles({ variant }), className)}
      data-slot="alert"
      data-variant={variant}
      role={role ?? defaultRole(variant)}
    >
      {title ? (
        <div className={cn(alertTitle, alertTitleTone({ variant }))} data-slot="alert-title">
          {title}
        </div>
      ) : null}
      {children ? (
        <div className={alertDescription} data-slot="alert-description">
          {children}
        </div>
      ) : null}
    </div>
  );
}
