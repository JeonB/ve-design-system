import { Children, cloneElement, isValidElement, useLayoutEffect, useRef, useState } from "react";
import { cn } from "../utils/cn";
import { mergeRefs } from "../utils/merge-refs";
import {
  buttonIconSlot,
  buttonLabel,
  buttonSpinnerOverlay,
  buttonStyles,
  spinnerStyles
} from "./button.css";
import { VisuallyHidden } from "./visually-hidden";

const SPINNER_SIZE_BY_BUTTON = {
  sm: "sm",
  md: "md",
  lg: "lg",
  icon: "md"
};

function Spinner({ size = "md" }) {
  return (
    <span aria-hidden="true" className={spinnerStyles({ size })} role="presentation" />
  );
}

function warnIconOnlyWithoutLabel(iconOnly, ariaLabel) {
  if (iconOnly && !ariaLabel && process.env.NODE_ENV !== "production") {
    console.warn(
      "[@ve/ui Button] iconOnly 사용 시 스크린 리더를 위해 aria-label을 제공하세요."
    );
  }
}

function getLoadingAnnouncement(loadingText, children) {
  if (typeof loadingText === "string" && loadingText.length > 0) {
    return loadingText;
  }

  if (typeof children === "string" && children.length > 0) {
    return `${children} 처리 중`;
  }

  return "처리 중";
}

/**
 * @param {object} props
 * @param {import('react').Ref<HTMLButtonElement>} [props.ref]
 * @param {"solid"|"secondary"|"outline"|"ghost"|"danger"|"dangerOutline"|"link"} [props.variant]
 * @param {"sm"|"md"|"lg"|"icon"} [props.size]
 * @param {boolean} [props.fullWidth]
 * @param {boolean} [props.loading]
 * @param {string} [props.loadingText]
 * @param {import('react').ReactNode} [props.leftIcon]
 * @param {import('react').ReactNode} [props.rightIcon]
 * @param {boolean} [props.iconOnly]
 * @param {boolean} [props.pressed]
 * @param {boolean} [props.asChild]
 * @param {string} [props.className]
 * @param {string} [props.type]
 * @param {import('react').ReactNode} props.children
 */
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
}) {
  const innerRef = useRef(null);
  const [lockedWidth, setLockedWidth] = useState(undefined);
  const resolvedSize = iconOnly ? "icon" : size;
  const isDisabled = Boolean(disabled || loading);
  const spinnerSize = SPINNER_SIZE_BY_BUTTON[resolvedSize ?? "md"];
  const iconSlotSize = resolvedSize ?? "md";

  warnIconOnlyWithoutLabel(iconOnly, ariaLabel);

  useLayoutEffect(() => {
    if (!loading) {
      setLockedWidth(undefined);
      return;
    }

    const node = innerRef.current;
    if (!node || lockedWidth !== undefined) return;

    setLockedWidth(node.offsetWidth);
  }, [loading, lockedWidth]);

  const classes = cn(
    buttonStyles({
      variant,
      size: resolvedSize,
      fullWidth,
      loading
    }),
    className
  );

  const sharedProps = {
    ...props,
    ref: mergeRefs(ref, innerRef),
    className: classes,
    style: lockedWidth ? { minWidth: lockedWidth, ...(style ?? {}) } : style,
    "aria-busy": loading || undefined,
    "aria-disabled": isDisabled || undefined,
    "aria-pressed": pressed ?? undefined,
    "data-loading": loading ? "true" : undefined,
    "data-icon-only": iconOnly ? "true" : undefined,
    "data-pressed": pressed ? "true" : undefined
  };

  const content = (
    <>
      {loading ? (
        <>
          <span className={buttonSpinnerOverlay}>
            <Spinner size={spinnerSize} />
          </span>
          <VisuallyHidden aria-live="polite">
            {getLoadingAnnouncement(loadingText, children)}
          </VisuallyHidden>
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

  if (asChild) {
    if (loading || leftIcon || rightIcon || iconOnly || pressed !== undefined) {
      throw new Error(
        "[@ve/ui Button] asChild는 loading·icon·iconOnly·pressed와 함께 사용할 수 없습니다."
      );
    }

    const child = Children.only(children);

    if (!isValidElement(child)) {
      throw new Error("[@ve/ui Button] asChild는 단일 React 엘리먼트 자식이 필요합니다.");
    }

    return cloneElement(child, {
      ...child.props,
      ...sharedProps,
      ref: mergeRefs(ref, innerRef, child.props.ref),
      className: cn(classes, child.props.className),
      "aria-label": ariaLabel ?? child.props["aria-label"],
      ...(isDisabled ? { tabIndex: -1 } : {})
    });
  }

  const accessibleLabel = loading
    ? getLoadingAnnouncement(loadingText, children)
    : ariaLabel;

  return (
    <button
      {...sharedProps}
      aria-label={accessibleLabel}
      disabled={isDisabled}
      type={type}
    >
      {content}
    </button>
  );
}
