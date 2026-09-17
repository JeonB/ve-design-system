import {
  createContext,
  useCallback,
  useContext,
  useId,
  useMemo,
  useState,
  type HTMLAttributes,
  type ReactNode
} from "react";
import { cn } from "../utils/cn";
import { choiceGroupItem, choiceGroupLegend, choiceGroupRoot } from "./choice-group.css";
import { radioDot, radioInput, radioRoot } from "./radio.css";

type RadioGroupContextValue = {
  name: string;
  value: string;
  disabled: boolean;
  invalid: boolean;
  onSelect: (itemValue: string) => void;
};

const RadioGroupContext = createContext<RadioGroupContextValue | null>(null);

function useRadioGroupContext() {
  const context = useContext(RadioGroupContext);
  if (!context) {
    throw new Error("[@ve/ui RadioGroup] Item은 RadioGroup 안에서만 사용할 수 있습니다.");
  }
  return context;
}

export type RadioGroupProps = Omit<HTMLAttributes<HTMLFieldSetElement>, "onChange"> & {
  name: string;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  legend?: ReactNode;
  disabled?: boolean;
  invalid?: boolean;
  orientation?: "vertical" | "horizontal";
  gap?: "sm" | "md";
  fullWidth?: boolean;
  children: ReactNode;
};

function RadioGroupRoot({
  name,
  value,
  defaultValue = "",
  onValueChange,
  legend,
  disabled = false,
  invalid = false,
  orientation = "vertical",
  gap = "sm",
  fullWidth = false,
  className,
  children,
  ...props
}: RadioGroupProps) {
  const isControlled = value !== undefined;
  const [uncontrolled, setUncontrolled] = useState(defaultValue);
  const resolvedValue = isControlled ? value : uncontrolled;

  const onSelect = useCallback(
    (itemValue: string) => {
      if (!isControlled) setUncontrolled(itemValue);
      onValueChange?.(itemValue);
    },
    [isControlled, onValueChange]
  );

  const context = useMemo(
    () => ({ name, value: resolvedValue, disabled, invalid, onSelect }),
    [name, resolvedValue, disabled, invalid, onSelect]
  );

  return (
    <RadioGroupContext.Provider value={context}>
      <fieldset
        {...props}
        className={cn(choiceGroupRoot({ orientation, gap, fullWidth }), className)}
        data-invalid={invalid ? "true" : undefined}
        data-orientation={orientation}
        data-slot="radio-group"
        disabled={disabled}
        role="radiogroup"
      >
        {legend ? <legend className={choiceGroupLegend}>{legend}</legend> : null}
        {children}
      </fieldset>
    </RadioGroupContext.Provider>
  );
}

export type RadioGroupItemProps = {
  value: string;
  disabled?: boolean;
  children: ReactNode;
  className?: string;
};

export function RadioGroupItem({ value, disabled, children, className }: RadioGroupItemProps) {
  const group = useRadioGroupContext();
  const id = useId();
  const isDisabled = Boolean(disabled || group.disabled);
  const checked = group.value === value;

  return (
    <label
      className={cn(choiceGroupItem, className)}
      data-disabled={isDisabled ? "true" : undefined}
      data-slot="radio-group-item"
      htmlFor={id}
    >
      <span
        className={radioRoot({ size: "md" })}
        data-checked={checked ? "true" : undefined}
        data-disabled={isDisabled ? "true" : undefined}
        data-invalid={group.invalid ? "true" : undefined}
        data-slot="radio"
      >
        <input
          checked={checked}
          className={radioInput}
          disabled={isDisabled}
          id={id}
          name={group.name}
          type="radio"
          value={value}
          onChange={() => group.onSelect(value)}
        />
        <span aria-hidden="true" className={radioDot} />
      </span>
      <span>{children}</span>
    </label>
  );
}

/** 단일 선택 라디오 그룹. controlled value(string)와 legend를 지원한다. */
export const RadioGroup = Object.assign(RadioGroupRoot, {
  Item: RadioGroupItem
});
