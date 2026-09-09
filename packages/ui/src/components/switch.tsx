import { useState, type ButtonHTMLAttributes, type Ref } from "react";
import { cn } from "../utils/cn";
import { switchRoot, switchThumb, type SwitchSize } from "./switch.css";

export type { SwitchSize };

export type SwitchProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "onChange"> & {
  ref?: Ref<HTMLButtonElement>;
  size?: SwitchSize;
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
};

/**
 * 즉시 적용형 on/off 토글. role="switch" 버튼을 사용한다.
 * 폼 제출용 선택값은 Checkbox를 쓴다.
 */
export function Switch({
  ref,
  size = "md",
  checked,
  defaultChecked = false,
  disabled = false,
  className,
  onCheckedChange,
  onClick,
  ...props
}: SwitchProps) {
  const isControlled = checked !== undefined;
  const [uncontrolled, setUncontrolled] = useState(defaultChecked);
  const isChecked = isControlled ? Boolean(checked) : uncontrolled;

  return (
    <button
      {...props}
      ref={ref}
      aria-checked={isChecked}
      className={cn(switchRoot({ size }), className)}
      data-checked={isChecked ? "true" : undefined}
      data-disabled={disabled ? "true" : undefined}
      data-size={size}
      data-slot="switch"
      disabled={disabled}
      role="switch"
      type="button"
      onClick={(event) => {
        onClick?.(event);
        if (event.defaultPrevented || disabled) return;
        const next = !isChecked;
        if (!isControlled) setUncontrolled(next);
        onCheckedChange?.(next);
      }}
    >
      <span aria-hidden="true" className={switchThumb({ size })} />
    </button>
  );
}
