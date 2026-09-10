import type { Ref, SelectHTMLAttributes } from "react";
import { cn } from "../utils/cn";
import { joinIds } from "../utils/join-ids";
import { useOptionalFieldContext } from "./field";
import { selectField, selectIcon, selectShell, type SelectSize } from "./select.css";

export type { SelectSize };

export type SelectProps = Omit<SelectHTMLAttributes<HTMLSelectElement>, "size"> & {
  ref?: Ref<HTMLSelectElement>;
  size?: SelectSize;
  invalid?: boolean;
  fullWidth?: boolean;
};

/**
 * 네이티브 select를 Input 톤으로 스타일링한 단일 선택 컨트롤.
 * Field 컨텍스트의 id·describedBy·invalid/disabled/required를 상속한다.
 */
export function Select({
  ref,
  id,
  size = "md",
  invalid,
  fullWidth = false,
  disabled,
  required,
  className,
  style,
  children,
  ...props
}: SelectProps) {
  const field = useOptionalFieldContext();
  const isInvalid = invalid ?? field?.invalid ?? false;
  const isDisabled = Boolean(disabled ?? field?.disabled);
  const isRequired = Boolean(required ?? field?.required);
  const isFullWidth = fullWidth || Boolean(field?.fullWidth);

  return (
    <div
      className={cn(selectShell({ size, fullWidth: isFullWidth }), className)}
      data-disabled={isDisabled ? "true" : undefined}
      data-invalid={isInvalid ? "true" : undefined}
      data-size={size}
      data-slot="select"
      style={style}
    >
      <select
        {...props}
        ref={ref}
        aria-describedby={joinIds(props["aria-describedby"], field?.describedBy)}
        aria-invalid={isInvalid || undefined}
        className={selectField({ size })}
        disabled={isDisabled}
        id={id ?? field?.controlId}
        required={isRequired}
      >
        {children}
      </select>
      <svg aria-hidden="true" className={selectIcon} fill="none" viewBox="0 0 16 16">
        <path
          d="M4 6l4 4 4-4"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
        />
      </svg>
    </div>
  );
}
