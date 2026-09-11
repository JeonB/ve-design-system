import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type HTMLAttributes,
  type ReactNode
} from "react";
import { createPortal } from "react-dom";
import { cn } from "../utils/cn";
import { useFocusTrap } from "../hooks/use-focus-trap";
import {
  dialogClose,
  dialogContent,
  dialogDescription,
  dialogFooter,
  dialogHeader,
  dialogOverlay,
  dialogTitle
} from "./dialog.css";
import { Button } from "./button";

type DialogContextValue = {
  open: boolean;
  setOpen: (open: boolean) => void;
  titleId: string;
  descriptionId: string;
  contentRef: React.RefObject<HTMLDivElement | null>;
};

const DialogContext = createContext<DialogContextValue | null>(null);

function useDialogContext() {
  const context = useContext(DialogContext);
  if (!context) {
    throw new Error("[@ve/ui Dialog] 하위 컴포넌트는 Dialog 안에서만 사용할 수 있습니다.");
  }
  return context;
}

export type DialogProps = {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: ReactNode;
};

function DialogRoot({ open, defaultOpen = false, onOpenChange, children }: DialogProps) {
  const isControlled = open !== undefined;
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
  const resolvedOpen = isControlled ? Boolean(open) : uncontrolledOpen;
  const contentRef = useRef<HTMLDivElement | null>(null);
  const id = useId();

  const setOpen = useCallback(
    (next: boolean) => {
      if (!isControlled) setUncontrolledOpen(next);
      onOpenChange?.(next);
    },
    [isControlled, onOpenChange]
  );

  const value = useMemo(
    () => ({
      open: resolvedOpen,
      setOpen,
      titleId: `${id}-title`,
      descriptionId: `${id}-description`,
      contentRef
    }),
    [resolvedOpen, setOpen, id]
  );

  return <DialogContext.Provider value={value}>{children}</DialogContext.Provider>;
}

export type DialogContentProps = HTMLAttributes<HTMLDivElement> & {
  /** 오버레이 클릭 시 닫기 (기본 true) */
  closeOnOverlayClick?: boolean;
  /** Esc 시 닫기 (기본 true) */
  closeOnEscape?: boolean;
};

export function DialogContent({
  className,
  children,
  closeOnOverlayClick = true,
  closeOnEscape = true,
  ...props
}: DialogContentProps) {
  const { open, setOpen, titleId, descriptionId, contentRef } = useDialogContext();
  useFocusTrap(open, contentRef);

  useEffect(() => {
    if (!open || !closeOnEscape) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        setOpen(false);
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, closeOnEscape, setOpen]);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  if (!open || typeof document === "undefined") {
    return null;
  }

  return createPortal(
    <div
      className={dialogOverlay}
      data-slot="dialog-overlay"
      onMouseDown={(event) => {
        if (!closeOnOverlayClick) return;
        if (event.target === event.currentTarget) setOpen(false);
      }}
    >
      <div
        {...props}
        ref={contentRef}
        aria-describedby={descriptionId}
        aria-labelledby={titleId}
        aria-modal="true"
        className={cn(dialogContent, className)}
        data-slot="dialog-content"
        role="dialog"
        tabIndex={-1}
      >
        {children}
      </div>
    </div>,
    document.body
  );
}

export type DialogHeaderProps = HTMLAttributes<HTMLDivElement>;
export function DialogHeader({ className, ...props }: DialogHeaderProps) {
  return <div {...props} className={cn(dialogHeader, className)} data-slot="dialog-header" />;
}

export type DialogTitleProps = HTMLAttributes<HTMLHeadingElement>;
export function DialogTitle({ className, id, ...props }: DialogTitleProps) {
  const { titleId } = useDialogContext();
  return (
    <h2 {...props} className={cn(dialogTitle, className)} data-slot="dialog-title" id={id ?? titleId} />
  );
}

export type DialogDescriptionProps = HTMLAttributes<HTMLParagraphElement>;
export function DialogDescription({ className, id, ...props }: DialogDescriptionProps) {
  const { descriptionId } = useDialogContext();
  return (
    <p
      {...props}
      className={cn(dialogDescription, className)}
      data-slot="dialog-description"
      id={id ?? descriptionId}
    />
  );
}

export type DialogFooterProps = HTMLAttributes<HTMLDivElement>;
export function DialogFooter({ className, ...props }: DialogFooterProps) {
  return <div {...props} className={cn(dialogFooter, className)} data-slot="dialog-footer" />;
}

export type DialogCloseProps = {
  className?: string;
  children?: ReactNode;
};

/** Dialog를 닫는 아이콘/텍스트 버튼. */
export function DialogClose({ className, children = "Close" }: DialogCloseProps) {
  const { setOpen } = useDialogContext();

  return (
    <Button
      aria-label={typeof children === "string" ? children : "Close"}
      className={cn(dialogClose, className)}
      data-slot="dialog-close"
      size="sm"
      type="button"
      variant="ghost"
      onClick={() => setOpen(false)}
    >
      {children === "Close" ? "×" : children}
    </Button>
  );
}

/**
 * 모달 다이얼로그.
 * focus trap, Esc/오버레이 닫기, body scroll lock을 기본 제공한다.
 */
export const Dialog = Object.assign(DialogRoot, {
  Content: DialogContent,
  Header: DialogHeader,
  Title: DialogTitle,
  Description: DialogDescription,
  Footer: DialogFooter,
  Close: DialogClose
});
