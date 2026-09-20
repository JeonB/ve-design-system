import type { HTMLAttributes } from "react";
import { cn } from "../utils/cn";
import { VisuallyHidden } from "./visually-hidden";
import { spinnerStyles, type SpinnerSize } from "./button.css";

export type { SpinnerSize };

export type SpinnerProps = HTMLAttributes<HTMLSpanElement> & {
  size?: SpinnerSize;
  /** 단독 사용 시 스크린 리더 안내. 없으면 장식용(aria-hidden). */
  label?: string;
};

/** 로딩 인디케이터. Button 내부와 동일 스타일을 공개 API로 제공한다. */
export function Spinner({ size = "md", label, className, ...props }: SpinnerProps) {
  if (label) {
    return (
      <span
        {...props}
        className={cn(className)}
        data-size={size}
        data-slot="spinner"
        role="status"
      >
        <span aria-hidden="true" className={spinnerStyles({ size })} role="presentation" />
        <VisuallyHidden>{label}</VisuallyHidden>
      </span>
    );
  }

  return (
    <span
      {...props}
      aria-hidden="true"
      className={cn(spinnerStyles({ size }), className)}
      data-size={size}
      data-slot="spinner"
      role="presentation"
    />
  );
}
