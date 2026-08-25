import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useMemo,
  useState,
  type HTMLAttributes,
  type LabelHTMLAttributes,
  type ReactNode
} from "react";
import { cn } from "../utils/cn";
import { fieldDescription, fieldError, fieldLabel, fieldRoot } from "./field.css";

type FieldSlot = "description" | "error";

type FieldContextValue = {
  controlId: string;
  descriptionId: string;
  errorId: string;
  invalid: boolean;
  required: boolean;
  disabled: boolean;
  fullWidth: boolean;
  describedBy: string | undefined;
  setSlotPresent: (slot: FieldSlot, present: boolean) => void;
};

const FieldContext = createContext<FieldContextValue | null>(null);

export function useFieldContext() {
  const context = useContext(FieldContext);

  if (!context) {
    throw new Error("[@ve/ui Field] Label·Description·Error는 Field 안에서만 사용할 수 있습니다.");
  }

  return context;
}

export function useOptionalFieldContext() {
  return useContext(FieldContext);
}

export type FieldProps = HTMLAttributes<HTMLDivElement> & {
  invalid?: boolean;
  required?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  children: ReactNode;
};

function FieldRoot({
  invalid = false,
  required = false,
  disabled = false,
  fullWidth = false,
  className,
  children,
  ...props
}: FieldProps) {
  const id = useId();
  const controlId = `${id}-control`;
  const descriptionId = `${id}-description`;
  const errorId = `${id}-error`;
  const [slots, setSlots] = useState({ description: false, error: false });

  const setSlotPresent = useCallback((slot: FieldSlot, present: boolean) => {
    setSlots((current) => (current[slot] === present ? current : { ...current, [slot]: present }));
  }, []);

  const describedBy = [slots.description ? descriptionId : undefined, slots.error ? errorId : undefined]
    .filter((value): value is string => Boolean(value))
    .join(" ");

  const value = useMemo<FieldContextValue>(
    () => ({
      controlId,
      descriptionId,
      errorId,
      invalid,
      required,
      disabled,
      fullWidth,
      describedBy: describedBy.length > 0 ? describedBy : undefined,
      setSlotPresent
    }),
    [controlId, descriptionId, errorId, invalid, required, disabled, fullWidth, describedBy, setSlotPresent]
  );

  return (
    <FieldContext.Provider value={value}>
      <div
        {...props}
        className={cn(fieldRoot({ fullWidth }), className)}
        data-disabled={disabled ? "true" : undefined}
        data-invalid={invalid ? "true" : undefined}
        data-slot="field"
      >
        {children}
      </div>
    </FieldContext.Provider>
  );
}

export type FieldLabelProps = LabelHTMLAttributes<HTMLLabelElement>;

/** 연결된 Input을 가리키는 레이블. */
export function FieldLabel({ className, htmlFor, ...props }: FieldLabelProps) {
  const { controlId } = useFieldContext();

  return (
    <label {...props} className={cn(fieldLabel, className)} data-slot="field-label" htmlFor={htmlFor ?? controlId} />
  );
}

export type FieldDescriptionProps = HTMLAttributes<HTMLParagraphElement>;

/** 컨트롤 보조 설명. Input의 aria-describedby에 포함된다. */
export function FieldDescription({ className, id, ...props }: FieldDescriptionProps) {
  const { descriptionId, setSlotPresent } = useFieldContext();

  useEffect(() => {
    setSlotPresent("description", true);
    return () => setSlotPresent("description", false);
  }, [setSlotPresent]);

  return (
    <p
      {...props}
      className={cn(fieldDescription, className)}
      data-slot="field-description"
      id={id ?? descriptionId}
    />
  );
}

export type FieldErrorProps = HTMLAttributes<HTMLParagraphElement>;

/** 검증 실패 메시지. role="alert"로 스크린 리더에 알린다. */
export function FieldError({ className, id, ...props }: FieldErrorProps) {
  const { errorId, setSlotPresent } = useFieldContext();

  useEffect(() => {
    setSlotPresent("error", true);
    return () => setSlotPresent("error", false);
  }, [setSlotPresent]);

  return (
    <p
      {...props}
      className={cn(fieldError, className)}
      data-slot="field-error"
      id={id ?? errorId}
      role="alert"
    />
  );
}

/**
 * 폼 컨트롤을 레이블·설명·오류 메시지와 연결하는 합성 컴포넌트.
 * Input은 Field 컨텍스트의 id, aria-describedby, invalid/disabled/required를 자동으로 상속한다.
 *
 * @example
 * <Field invalid>
 *   <Field.Label>Email</Field.Label>
 *   <Input name="email" />
 *   <Field.Error>Enter a valid email.</Field.Error>
 * </Field>
 */
export const Field = Object.assign(FieldRoot, {
  Label: FieldLabel,
  Description: FieldDescription,
  Error: FieldError
});
