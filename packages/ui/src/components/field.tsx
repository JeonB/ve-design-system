import {
  createContext,
  useCallback,
  useContext,
  useId,
  useLayoutEffect,
  useMemo,
  useState,
  type HTMLAttributes,
  type LabelHTMLAttributes,
  type ReactNode
} from "react";
import { cn } from "../utils/cn";
import { fieldDescription, fieldError, fieldLabel, fieldRequiredMark, fieldRoot } from "./field.css";

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
  setSlotId: (slot: FieldSlot, id: string | undefined) => void;
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
  const [slots, setSlots] = useState<{ description?: string; error?: string }>({});

  const setSlotId = useCallback((slot: FieldSlot, slotId: string | undefined) => {
    setSlots((current) => {
      if (current[slot] === slotId) {
        return current;
      }

      return { ...current, [slot]: slotId };
    });
  }, []);

  const describedBy = [slots.description, slots.error].filter((value): value is string => Boolean(value)).join(" ");

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
      setSlotId
    }),
    [controlId, descriptionId, errorId, invalid, required, disabled, fullWidth, describedBy, setSlotId]
  );

  return (
    <FieldContext.Provider value={value}>
      <div
        {...props}
        className={cn(fieldRoot({ fullWidth }), className)}
        data-disabled={disabled ? "true" : undefined}
        data-invalid={invalid ? "true" : undefined}
        data-required={required ? "true" : undefined}
        data-slot="field"
      >
        {children}
      </div>
    </FieldContext.Provider>
  );
}

export type FieldLabelProps = LabelHTMLAttributes<HTMLLabelElement>;

/** 연결된 Input을 가리키는 레이블. required일 때 시각적 표시를 붙인다. */
export function FieldLabel({ className, htmlFor, children, ...props }: FieldLabelProps) {
  const { controlId, required } = useFieldContext();

  return (
    <label
      {...props}
      className={cn(fieldLabel, className)}
      data-required={required ? "true" : undefined}
      data-slot="field-label"
      htmlFor={htmlFor ?? controlId}
    >
      {children}
      {required ? (
        <span aria-hidden="true" className={fieldRequiredMark}>
          {" *"}
        </span>
      ) : null}
    </label>
  );
}

export type FieldDescriptionProps = HTMLAttributes<HTMLParagraphElement>;

/** 컨트롤 보조 설명. Input의 aria-describedby에 포함된다. */
export function FieldDescription({ className, id, ...props }: FieldDescriptionProps) {
  const { descriptionId, setSlotId } = useFieldContext();
  const resolvedId = id ?? descriptionId;

  useLayoutEffect(() => {
    setSlotId("description", resolvedId);
    return () => setSlotId("description", undefined);
  }, [resolvedId, setSlotId]);

  return (
    <p {...props} className={cn(fieldDescription, className)} data-slot="field-description" id={resolvedId} />
  );
}

export type FieldErrorProps = HTMLAttributes<HTMLParagraphElement>;

/** 검증 실패 메시지. Field가 invalid일 때 role="alert"로 알린다. */
export function FieldError({ className, id, ...props }: FieldErrorProps) {
  const { errorId, invalid, setSlotId } = useFieldContext();
  const resolvedId = id ?? errorId;

  useLayoutEffect(() => {
    setSlotId("error", resolvedId);
    return () => setSlotId("error", undefined);
  }, [resolvedId, setSlotId]);

  return (
    <p
      {...props}
      className={cn(fieldError, className)}
      data-slot="field-error"
      id={resolvedId}
      role={invalid ? "alert" : undefined}
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
