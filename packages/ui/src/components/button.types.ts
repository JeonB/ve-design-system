import type { ButtonHTMLAttributes, CSSProperties, ReactElement, ReactNode, Ref } from "react";
import type { ButtonSize, ButtonVariant } from "./button.css";

export type { ButtonVariant };
export type ButtonVariantOption = ButtonVariant;

export const BUTTON_VARIANTS = [
  "solid",
  "secondary",
  "outline",
  "ghost",
  "danger",
  "dangerOutline",
  "link"
] as const satisfies readonly ButtonVariant[];

type ButtonElementProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children">;

type ButtonCommonProps = ButtonElementProps & {
  ref?: Ref<HTMLButtonElement>;
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  loading?: boolean;
  loadingText?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  pressed?: boolean;
  className?: string;
};

type AsChildRestrictedProps = {
  loading?: never;
  loadingText?: never;
  leftIcon?: never;
  rightIcon?: never;
  iconOnly?: never;
  pressed?: never;
};

export type ButtonAsChildProps = ButtonCommonProps &
  AsChildRestrictedProps & {
    asChild: true;
    children: ReactElement;
  };

export type ButtonIconOnlyProps = ButtonCommonProps & {
  asChild?: false;
  iconOnly: true;
  "aria-label": string;
  children: ReactNode;
};

export type ButtonDefaultProps = ButtonCommonProps & {
  asChild?: false;
  iconOnly?: false;
  children: ReactNode;
};

export type ButtonProps = ButtonDefaultProps | ButtonIconOnlyProps | ButtonAsChildProps;

export type AsChildElementProps = {
  className?: string;
  ref?: Ref<HTMLElement>;
  style?: CSSProperties;
  tabIndex?: number;
  "aria-label"?: string;
  onClick?: ButtonHTMLAttributes<HTMLElement>["onClick"];
  onKeyDown?: ButtonHTMLAttributes<HTMLElement>["onKeyDown"];
};

export type AsChildElement = ReactElement<AsChildElementProps>;
