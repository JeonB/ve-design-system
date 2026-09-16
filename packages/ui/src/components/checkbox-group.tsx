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
import { Checkbox } from "./checkbox";
import { choiceGroupItem, choiceGroupLegend, choiceGroupRoot } from "./choice-group.css";

type CheckboxGroupContextValue = {
  name: string;
  value: string[];
  disabled: boolean;
  invalid: boolean;
  onToggle: (itemValue: string, checked: boolean) => void;
};

const CheckboxGroupContext = createContext<CheckboxGroupContextValue | null>(null);

function useCheckboxGroupContext() {
  const context = useContext(CheckboxGroupContext);
  if (!context) {
    throw new Error("[@ve/ui CheckboxGroup] Item은 CheckboxGroup 안에서만 사용할 수 있습니다.");
  }
  return context;
}

export type CheckboxGroupProps = Omit<HTMLAttributes<HTMLFieldSetElement>, "onChange"> & {
  name: string;
  value?: string[];
  defaultValue?: string[];
  onValueChange?: (value: string[]) => void;
  legend?: ReactNode;
  disabled?: boolean;
  invalid?: boolean;
  orientation?: "vertical" | "horizontal";
  gap?: "sm" | "md";
  fullWidth?: boolean;
  children: ReactNode;
};

function CheckboxGroupRoot({
  name,
  value,
  defaultValue = [],
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
}: CheckboxGroupProps) {
  const isControlled = value !== undefined;
  const [uncontrolled, setUncontrolled] = useState(defaultValue);
  const resolvedValue = isControlled ? value : uncontrolled;

  const onToggle = useCallback(
    (itemValue: string, checked: boolean) => {
      const next = checked
        ? [...new Set([...resolvedValue, itemValue])]
        : resolvedValue.filter((entry) => entry !== itemValue);
      if (!isControlled) setUncontrolled(next);
      onValueChange?.(next);
    },
    [isControlled, onValueChange, resolvedValue]
  );

  const context = useMemo(
    () => ({ name, value: resolvedValue, disabled, invalid, onToggle }),
    [name, resolvedValue, disabled, invalid, onToggle]
  );

  return (
    <CheckboxGroupContext.Provider value={context}>
      <fieldset
        {...props}
        className={cn(choiceGroupRoot({ orientation, gap, fullWidth }), className)}
        data-invalid={invalid ? "true" : undefined}
        data-orientation={orientation}
        data-slot="checkbox-group"
        disabled={disabled}
      >
        {legend ? <legend className={choiceGroupLegend}>{legend}</legend> : null}
        {children}
      </fieldset>
    </CheckboxGroupContext.Provider>
  );
}

export type CheckboxGroupItemProps = {
  value: string;
  disabled?: boolean;
  children: ReactNode;
  className?: string;
};

export function CheckboxGroupItem({ value, disabled, children, className }: CheckboxGroupItemProps) {
  const group = useCheckboxGroupContext();
  const id = useId();
  const isDisabled = Boolean(disabled || group.disabled);
  const checked = group.value.includes(value);

  return (
    <label
      className={cn(choiceGroupItem, className)}
      data-disabled={isDisabled ? "true" : undefined}
      data-slot="checkbox-group-item"
      htmlFor={id}
    >
      <Checkbox
        checked={checked}
        disabled={isDisabled}
        id={id}
        invalid={group.invalid}
        name={group.name}
        value={value}
        onCheckedChange={(next) => group.onToggle(value, next)}
      />
      <span>{children}</span>
    </label>
  );
}

/** 다중 선택 체크박스 그룹. controlled value(string[])와 legend를 지원한다. */
export const CheckboxGroup = Object.assign(CheckboxGroupRoot, {
  Item: CheckboxGroupItem
});
