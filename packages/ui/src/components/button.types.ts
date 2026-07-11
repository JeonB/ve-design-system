import type { ButtonHTMLAttributes, CSSProperties, ReactElement, ReactNode, Ref } from "react";
import type { ButtonSize, ButtonVariant } from "./button.css";

export type { ButtonVariant };
export type ButtonVariantOption = ButtonVariant;

/** Storybook·문서용 variant 목록. recipe 정의와 satisfies로 동기화한다. */
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

/** `<a>` 등 자식 엘리먼트에 버튼 외형을 위임할 때 사용. loading·icon 등 내부 콘텐츠 API는 타입상 금지된다. */
export type ButtonAsChildProps = ButtonCommonProps &
  AsChildRestrictedProps & {
    asChild: true;
    children: ReactElement;
  };

/** 아이콘만 표시하는 버튼. 스크린 리더용 `aria-label`이 필수다. */
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

/** asChild / iconOnly / 기본 버튼을 discriminated union으로 분리해 잘못된 prop 조합을 컴파일 타임에 차단한다. */
export type ButtonProps = ButtonDefaultProps | ButtonIconOnlyProps | ButtonAsChildProps;

/** asChild cloneElement 대상으로 허용되는 자식 props. */
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
