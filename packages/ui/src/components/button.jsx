import { Children, cloneElement, isValidElement } from "react";
import {
  buttonIconSlot,
  buttonLabel,
  buttonSpinnerOverlay,
  buttonStyles,
  spinnerStyles
} from "./button.css";

const SPINNER_SIZE_BY_BUTTON = {
  sm: "sm",
  md: "md",
  lg: "lg",
  icon: "md"
};

function Spinner({ size = "md" }) {
  return (
    <span
      aria-hidden="true"
      className={spinnerStyles({ size })}
      role="presentation"
    />
  );
}

function mergeClassNames(...values) {
  return values.filter(Boolean).join(" ");
}

function warnIconOnlyWithoutLabel(iconOnly, ariaLabel) {
  if (iconOnly && !ariaLabel && process.env.NODE_ENV !== "production") {
    console.warn(
      "[@ve/ui Button] iconOnly 사용 시 스크린 리더를 위해 aria-label을 제공하세요."
    );
  }
}

/**
 * @param {object} props
 * @param {"solid"|"outline"|"ghost"|"danger"|"link"} [props.variant]
 * @param {"sm"|"md"|"lg"|"icon"} [props.size]
 * @param {boolean} [props.fullWidth]
 * @param {boolean} [props.loading]
 * @param {string} [props.loadingText]
 * @param {import('react').ReactNode} [props.leftIcon]
 * @param {import('react').ReactNode} [props.rightIcon]
 * @param {boolean} [props.iconOnly]
 * @param {boolean} [props.asChild]
 * @param {string} [props.className]
 * @param {string} [props.type]
 * @param {import('react').ReactNode} props.children
 */
export function Button({
  variant,
  size,
  fullWidth = false,
  loading = false,
  loadingText,
  leftIcon,
  rightIcon,
  iconOnly = false,
  asChild = false,
  disabled = false,
  type = "button",
  className,
  children,
  "aria-label": ariaLabel,
  ...props
}) {
  const resolvedSize = iconOnly ? "icon" : size;
  const isDisabled = Boolean(disabled || loading);
  const spinnerSize = SPINNER_SIZE_BY_BUTTON[resolvedSize ?? "md"];

  warnIconOnlyWithoutLabel(iconOnly, ariaLabel);

  const classes = mergeClassNames(
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
    className: classes,
    "aria-busy": loading || undefined,
    "aria-disabled": isDisabled || undefined,
    "data-loading": loading ? "true" : undefined,
    "data-icon-only": iconOnly ? "true" : undefined
  };

  const content = (
    <>
      {loading ? (
        <span className={buttonSpinnerOverlay}>
          <Spinner size={spinnerSize} />
        </span>
      ) : null}
      {!loading && leftIcon && !iconOnly ? (
        <span className={buttonIconSlot}>{leftIcon}</span>
      ) : null}
      {!iconOnly ? (
        <span className={buttonLabel}>{loading && loadingText ? loadingText : children}</span>
      ) : (
        <span className={buttonIconSlot}>{children}</span>
      )}
      {!loading && rightIcon && !iconOnly ? (
        <span className={buttonIconSlot}>{rightIcon}</span>
      ) : null}
    </>
  );

  if (asChild) {
    if (loading || leftIcon || rightIcon || iconOnly) {
      throw new Error(
        "[@ve/ui Button] asChild는 loading·icon 슬롯·iconOnly와 함께 사용할 수 없습니다."
      );
    }

    const child = Children.only(children);

    if (!isValidElement(child)) {
      throw new Error("[@ve/ui Button] asChild는 단일 React 엘리먼트 자식이 필요합니다.");
    }

    return cloneElement(child, {
      ...child.props,
      ...sharedProps,
      className: mergeClassNames(classes, child.props.className),
      "aria-label": ariaLabel ?? child.props["aria-label"],
      ...(isDisabled ? { tabIndex: -1 } : {})
    });
  }

  return (
    <button
      {...sharedProps}
      aria-label={ariaLabel}
      disabled={isDisabled}
      type={type}
    >
      {content}
    </button>
  );
}
