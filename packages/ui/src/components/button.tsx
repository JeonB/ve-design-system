import {
  Children,
  cloneElement,
  isValidElement,
  type MouseEvent,
  type KeyboardEvent
} from "react";
import { cn } from "../utils/cn";
import { mergeHandlers } from "../utils/merge-handlers";
import { mergeRefs } from "../utils/merge-refs";
import { useLoadingWidthLock } from "../hooks/use-loading-width-lock";
import { buttonStyles, type ButtonSize } from "./button.css";
import {
  ButtonContent,
  getLoadingAnnouncement,
  warnIconOnlyWithoutLabel
} from "./button-content";
import type { AsChildElement, ButtonProps } from "./button.types";

function preventInteractionWhenDisabled(isDisabled: boolean) {
  return {
    onClick: (event: MouseEvent<HTMLElement>) => {
      if (!isDisabled) return;
      event.preventDefault();
      event.stopPropagation();
    },
    onKeyDown: (event: KeyboardEvent<HTMLElement>) => {
      if (!isDisabled) return;
      if (event.key !== "Enter" && event.key !== " ") return;
      event.preventDefault();
      event.stopPropagation();
    }
  };
}

export function Button({
  ref,
  variant,
  size,
  fullWidth = false,
  loading = false,
  loadingText,
  leftIcon,
  rightIcon,
  iconOnly = false,
  pressed,
  asChild = false,
  disabled = false,
  type = "button",
  className,
  children,
  "aria-label": ariaLabel,
  style,
  ...props
}: ButtonProps) {
  const resolvedSize: ButtonSize = iconOnly ? "icon" : (size ?? "md");
  const isDisabled = Boolean(disabled || loading);
  const iconSlotSize = resolvedSize;
  const loadingAnnouncement = getLoadingAnnouncement(loadingText, children);

  warnIconOnlyWithoutLabel(iconOnly, ariaLabel);

  const { ref: widthLockRef, style: lockedStyle } = useLoadingWidthLock({ loading, style });

  const classes = cn(
    buttonStyles({
      variant,
      size: resolvedSize,
      fullWidth,
      loading
    }),
    className
  );

  const dataProps = {
    "data-slot": "button",
    "data-variant": variant,
    "data-size": resolvedSize,
    "data-loading": loading ? "true" : undefined,
    "data-icon-only": iconOnly ? "true" : undefined,
    "data-pressed": pressed ? "true" : undefined
  };

  const ariaProps = {
    "aria-busy": loading || undefined,
    "aria-disabled": isDisabled || undefined,
    "aria-pressed": pressed ?? undefined
  };

  if (asChild) {
    const child = Children.only(children);

    if (!isValidElement(child)) {
      throw new Error("[@ve/ui Button] asChild는 단일 React 엘리먼트 자식이 필요합니다.");
    }

    const childElement = child as AsChildElement;
    const disabledGuards = preventInteractionWhenDisabled(isDisabled);

    return cloneElement(childElement, {
      ...childElement.props,
      ...props,
      ...dataProps,
      ...ariaProps,
      ref: mergeRefs(ref, widthLockRef, childElement.props.ref),
      className: cn(classes, childElement.props.className),
      style: lockedStyle,
      "aria-label": ariaLabel ?? childElement.props["aria-label"],
      onClick: isDisabled
        ? disabledGuards.onClick
        : mergeHandlers(childElement.props.onClick, props.onClick),
      onKeyDown: isDisabled
        ? disabledGuards.onKeyDown
        : mergeHandlers(childElement.props.onKeyDown, props.onKeyDown),
      ...(isDisabled ? { tabIndex: -1 } : {})
    });
  }

  const accessibleLabel = loading ? loadingAnnouncement : ariaLabel;

  return (
    <button
      {...props}
      {...dataProps}
      {...ariaProps}
      ref={mergeRefs(ref, widthLockRef)}
      aria-label={accessibleLabel}
      className={classes}
      disabled={isDisabled}
      style={lockedStyle}
      type={type}
    >
      <ButtonContent
        iconOnly={iconOnly}
        iconSlotSize={iconSlotSize}
        leftIcon={leftIcon}
        loading={loading}
        loadingAnnouncement={loadingAnnouncement}
        rightIcon={rightIcon}
      >
        {children}
      </ButtonContent>
    </button>
  );
}

export { BUTTON_VARIANTS } from "./button.types";
export type {
  ButtonAsChildProps,
  ButtonDefaultProps,
  ButtonIconOnlyProps,
  ButtonProps,
  ButtonVariant,
  ButtonVariantOption
} from "./button.types";
