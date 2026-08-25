import type { InputHTMLAttributes, ReactNode, Ref } from "react";
import { cn } from "../utils/cn";
import { useOptionalFieldContext } from "./field";
import { inputField, inputIcon, inputShell, type InputSize } from "./input.css";

export type { InputSize };

export type InputProps = Omit<InputHTMLAttributes<HTMLInputElement>, "size"> & {
  ref?: Ref<HTMLInputElement>;
  size?: InputSize;
  invalid?: boolean;
  fullWidth?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
};

/**
 * 텍스트 입력 컨트롤.
 * Field 안에서 쓰면 레이블·설명·오류 id와 invalid/disabled/required가 자동 연결된다.
 */
export function Input({
  ref,
  id,
  size = "md",
  invalid,
  fullWidth = false,
  leftIcon,
  rightIcon,
  disabled,
  required,
  className,
  ...props
}: InputProps) {
  const field = useOptionalFieldContext();
  const isInvalid = invalid ?? field?.invalid ?? false;
  const isDisabled = Boolean(disabled ?? field?.disabled);
  const isRequired = Boolean(required ?? field?.required);
  const isFullWidth = fullWidth || Boolean(field?.fullWidth);

  return (
    <div
      className={cn(inputShell({ size, fullWidth: isFullWidth }), className)}
      data-disabled={isDisabled ? "true" : undefined}
      data-invalid={isInvalid ? "true" : undefined}
      data-size={size}
      data-slot="input"
    >
      {leftIcon ? (
        <span aria-hidden="true" className={inputIcon({ size })}>
          {leftIcon}
        </span>
      ) : null}
      <input
        {...props}
        ref={ref}
        aria-describedby={props["aria-describedby"] ?? field?.describedBy}
        aria-invalid={isInvalid || undefined}
        className={inputField}
        disabled={isDisabled}
        id={id ?? field?.controlId}
        required={isRequired}
      />
      {rightIcon ? (
        <span aria-hidden="true" className={inputIcon({ size })}>
          {rightIcon}
        </span>
      ) : null}
    </div>
  );
}
