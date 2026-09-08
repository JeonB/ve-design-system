import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type InputHTMLAttributes,
  type Ref
} from "react";
import { cn } from "../utils/cn";
import { joinIds } from "../utils/join-ids";
import { mergeRefs } from "../utils/merge-refs";
import { useOptionalFieldContext } from "./field";
import { checkboxIndicator, checkboxInput, checkboxRoot, type CheckboxSize } from "./checkbox.css";

export type { CheckboxSize };

export type CheckboxProps = Omit<InputHTMLAttributes<HTMLInputElement>, "size" | "type" | "onChange"> & {
  ref?: Ref<HTMLInputElement>;
  size?: CheckboxSize;
  invalid?: boolean;
  indeterminate?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
};

/** 네이티브 checkbox 기반 선택 컨트롤. Field의 invalid/disabled/required·describedBy를 상속한다. */
export function Checkbox({
  ref,
  id,
  size = "md",
  invalid,
  indeterminate = false,
  disabled,
  required,
  checked,
  defaultChecked = false,
  className,
  onCheckedChange,
  onChange,
  ...props
}: CheckboxProps) {
  const field = useOptionalFieldContext();
  const innerRef = useRef<HTMLInputElement>(null);
  const isInvalid = invalid ?? field?.invalid ?? false;
  const isDisabled = Boolean(disabled ?? field?.disabled);
  const isRequired = Boolean(required ?? field?.required);
  const isControlled = checked !== undefined;
  const [uncontrolledChecked, setUncontrolledChecked] = useState(Boolean(defaultChecked));
  const isChecked = isControlled ? Boolean(checked) : uncontrolledChecked;

  useEffect(() => {
    if (innerRef.current) {
      innerRef.current.indeterminate = indeterminate;
    }
  }, [indeterminate, isChecked]);

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    if (!isControlled) {
      setUncontrolledChecked(event.target.checked);
    }
    onChange?.(event);
    onCheckedChange?.(event.target.checked);
  }

  return (
    <span
      className={cn(checkboxRoot({ size }), className)}
      data-checked={isChecked ? "true" : undefined}
      data-disabled={isDisabled ? "true" : undefined}
      data-indeterminate={indeterminate ? "true" : undefined}
      data-invalid={isInvalid ? "true" : undefined}
      data-size={size}
      data-slot="checkbox"
    >
      <input
        {...props}
        ref={mergeRefs(ref, innerRef)}
        aria-describedby={joinIds(props["aria-describedby"], field?.describedBy)}
        aria-invalid={isInvalid || undefined}
        checked={isControlled ? checked : undefined}
        className={checkboxInput}
        defaultChecked={isControlled ? undefined : defaultChecked}
        disabled={isDisabled}
        id={id ?? field?.controlId}
        onChange={handleChange}
        required={isRequired}
        type="checkbox"
      />
      <svg aria-hidden="true" className={checkboxIndicator} fill="none" viewBox="0 0 16 16">
        {indeterminate ? (
          <path d="M3 8h10" stroke="currentColor" strokeLinecap="round" strokeWidth="2" />
        ) : (
          <path
            d="M3.5 8.5 6.5 11.5 12.5 4.5"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
          />
        )}
      </svg>
    </span>
  );
}
