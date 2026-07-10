import type { ReactNode } from "react";
import {
  buttonIconSlot,
  buttonLabel,
  buttonSpinnerOverlay,
  type ButtonSize,
  type SpinnerSize
} from "./button.css";
import { ButtonSpinner } from "./button-spinner";
import { VisuallyHidden } from "./visually-hidden";

const SPINNER_SIZE_BY_BUTTON: Record<ButtonSize, SpinnerSize> = {
  sm: "sm",
  md: "md",
  lg: "lg",
  icon: "md"
};

type ButtonContentProps = {
  loading: boolean;
  loadingAnnouncement: string;
  iconOnly: boolean;
  iconSlotSize: ButtonSize;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  children: ReactNode;
};

export function getLoadingAnnouncement(loadingText: string | undefined, children: ReactNode) {
  if (typeof loadingText === "string" && loadingText.length > 0) {
    return loadingText;
  }

  if (typeof children === "string" && children.length > 0) {
    return `${children} 처리 중`;
  }

  return "처리 중";
}

export function resolveSpinnerSize(size: ButtonSize) {
  return SPINNER_SIZE_BY_BUTTON[size];
}

export function ButtonContent({
  loading,
  loadingAnnouncement,
  iconOnly,
  iconSlotSize,
  leftIcon,
  rightIcon,
  children
}: ButtonContentProps) {
  return (
    <>
      {loading ? (
        <>
          <span className={buttonSpinnerOverlay}>
            <ButtonSpinner size={resolveSpinnerSize(iconSlotSize)} />
          </span>
          <VisuallyHidden aria-live="polite">{loadingAnnouncement}</VisuallyHidden>
        </>
      ) : null}
      {!loading && leftIcon && !iconOnly ? (
        <span className={buttonIconSlot({ size: iconSlotSize })}>{leftIcon}</span>
      ) : null}
      {!iconOnly ? (
        <span aria-hidden={loading ? true : undefined} className={buttonLabel}>
          {children}
        </span>
      ) : (
        <span className={buttonIconSlot({ size: iconSlotSize })}>{children}</span>
      )}
      {!loading && rightIcon && !iconOnly ? (
        <span className={buttonIconSlot({ size: iconSlotSize })}>{rightIcon}</span>
      ) : null}
    </>
  );
}

export function warnIconOnlyWithoutLabel(iconOnly: boolean, ariaLabel?: string) {
  if (iconOnly && !ariaLabel && process.env.NODE_ENV !== "production") {
    console.warn(
      "[@ve/ui Button] iconOnly 사용 시 스크린 리더를 위해 aria-label을 제공하세요."
    );
  }
}
