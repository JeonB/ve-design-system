import {
  Children,
  cloneElement,
  isValidElement,
  useLayoutEffect,
  useRef,
  useState,
  type ButtonHTMLAttributes,
  type ReactElement,
  type ReactNode,
  type Ref
} from "react";
import { cn } from "../utils/cn";
import { mergeRefs } from "../utils/merge-refs";
import {
  buttonIconSlot,
  buttonLabel,
  buttonSpinnerOverlay,
  buttonStyles,
  spinnerStyles,
  type ButtonSize,
  type ButtonVariant,
  type SpinnerSize
} from "./button.css";
import { VisuallyHidden } from "./visually-hidden";

const SPINNER_SIZE_BY_BUTTON: Record<ButtonSize, SpinnerSize> = {
  sm: "sm",
  md: "md",
  lg: "lg",
  icon: "md"
};

const BUTTON_VARIANTS = [
  "solid",
  "secondary",
  "outline",
  "ghost",
  "danger",
  "dangerOutline",
  "link"
] as const satisfies readonly ButtonVariant[];

export type { ButtonVariant };
export type ButtonVariantOption = ButtonVariant;

export type ButtonProps = {
  ref?: Ref<HTMLButtonElement>;
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  loading?: boolean;
  loadingText?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  iconOnly?: boolean;
  pressed?: boolean;
  asChild?: boolean;
  children: ReactNode;
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children">;

type AsChildElement = ReactElement<{
  className?: string;
  ref?: Ref<HTMLElement>;
  "aria-label"?: string;
}>;

type SpinnerProps = {
  size?: SpinnerSize;
};

function Spinner({ size = "md" }: SpinnerProps) {
  return (
    <span aria-hidden="true" className={spinnerStyles({ size })} role="presentation" />
  );
}

function warnIconOnlyWithoutLabel(iconOnly: boolean, ariaLabel?: string) {
  if (iconOnly && !ariaLabel && process.env.NODE_ENV !== "production") {
    console.warn(
      "[@ve/ui Button] iconOnly 사용 시 스크린 리더를 위해 aria-label을 제공하세요."
    );
  }
}

function getLoadingAnnouncement(loadingText: string | undefined, children: ReactNode) {
  if (typeof loadingText === "string" && loadingText.length > 0) {
    return loadingText;
  }

  if (typeof children === "string" && children.length > 0) {
    return `${children} 처리 중`;
  }

  return "처리 중";
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
  const innerRef = useRef<HTMLElement | null>(null);
  const [lockedWidth, setLockedWidth] = useState<number | undefined>(undefined);
  const resolvedSize: ButtonSize = iconOnly ? "icon" : (size ?? "md");
  const isDisabled = Boolean(disabled || loading);
  const spinnerSize = SPINNER_SIZE_BY_BUTTON[resolvedSize];
  const iconSlotSize = resolvedSize;

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

    const childElement = child as AsChildElement;

    return cloneElement(childElement, {
      ...childElement.props,
      ...sharedProps,
      ref: mergeRefs(ref, innerRef, childElement.props.ref),
      className: cn(classes, childElement.props.className),
      "aria-label": ariaLabel ?? childElement.props["aria-label"],
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

export { BUTTON_VARIANTS };
