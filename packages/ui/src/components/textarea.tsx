import { useRef, type PointerEvent, type Ref, type TextareaHTMLAttributes } from "react";
import { cn } from "../utils/cn";
import { joinIds } from "../utils/join-ids";
import { mergeRefs } from "../utils/merge-refs";
import { useOptionalFieldContext } from "./field";
import {
  textareaField,
  textareaShell,
  type TextareaResize,
  type TextareaSize
} from "./textarea.css";

export type { TextareaResize, TextareaSize };

export type TextareaProps = Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "size"> & {
  ref?: Ref<HTMLTextAreaElement>;
  size?: TextareaSize;
  invalid?: boolean;
  fullWidth?: boolean;
  resize?: TextareaResize;
};

/**
 * 멀티라인 텍스트 입력.
 * Field 컨텍스트의 id·aria-describedby·invalid/disabled/required를 Input과 동일하게 상속한다.
 */
export function Textarea({
  ref,
  id,
  size = "md",
  invalid,
  fullWidth = false,
  resize = "vertical",
  disabled,
  required,
  className,
  style,
  onPointerDown,
  rows = 4,
  ...props
}: TextareaProps) {
  const field = useOptionalFieldContext();
  const innerRef = useRef<HTMLTextAreaElement>(null);
  const isInvalid = invalid ?? field?.invalid ?? false;
  const isDisabled = Boolean(disabled ?? field?.disabled);
  const isRequired = Boolean(required ?? field?.required);
  const isFullWidth = fullWidth || Boolean(field?.fullWidth);

  function handlePointerDown(event: PointerEvent<HTMLDivElement>) {
    if (isDisabled) return;
    if (event.target instanceof HTMLElement && event.target.closest("textarea")) return;
    innerRef.current?.focus();
  }

  return (
    <div
      className={cn(textareaShell({ size, fullWidth: isFullWidth, resize }), className)}
      data-disabled={isDisabled ? "true" : undefined}
      data-invalid={isInvalid ? "true" : undefined}
      data-resize={resize}
      data-size={size}
      data-slot="textarea"
      onPointerDown={handlePointerDown}
      style={style}
    >
      <textarea
        {...props}
        ref={mergeRefs(ref, innerRef)}
        aria-describedby={joinIds(props["aria-describedby"], field?.describedBy)}
        aria-invalid={isInvalid || undefined}
        aria-required={isRequired || undefined}
        className={textareaField}
        disabled={isDisabled}
        id={id ?? field?.controlId}
        onPointerDown={onPointerDown}
        required={isRequired}
        rows={rows}
      />
    </div>
  );
}
