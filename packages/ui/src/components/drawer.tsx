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
import { Button } from "./button";
import {
  drawerBody,
  drawerClose,
  drawerContent,
  drawerDescription,
  drawerFooter,
  drawerHeader,
  drawerOverlay,
  drawerTitle,
  type DrawerSide
} from "./drawer.css";

export type { DrawerSide };

type DrawerContextValue = {
  open: boolean;
  setOpen: (open: boolean) => void;
  side: DrawerSide;
  titleId: string;
  descriptionId: string;
  descriptionPresent: boolean;
  setDescriptionPresent: (present: boolean) => void;
  contentRef: React.RefObject<HTMLDivElement | null>;
};

const DrawerContext = createContext<DrawerContextValue | null>(null);

function useDrawerContext() {
  const context = useContext(DrawerContext);
  if (!context) {
    throw new Error("[@ve/ui Drawer] 하위 컴포넌트는 Drawer 안에서만 사용할 수 있습니다.");
  }
  return context;
}

export type DrawerProps = {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  side?: DrawerSide;
  children: ReactNode;
};

function DrawerRoot({
  open,
  defaultOpen = false,
  onOpenChange,
  side = "right",
  children
}: DrawerProps) {
  const isControlled = open !== undefined;
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
  const resolvedOpen = isControlled ? Boolean(open) : uncontrolledOpen;
  const contentRef = useRef<HTMLDivElement | null>(null);
  const id = useId();
  const [descriptionPresent, setDescriptionPresent] = useState(false);

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
      side,
      titleId: `${id}-title`,
      descriptionId: `${id}-description`,
      descriptionPresent,
      setDescriptionPresent,
      contentRef
    }),
    [resolvedOpen, setOpen, side, id, descriptionPresent]
  );

  return <DrawerContext.Provider value={value}>{children}</DrawerContext.Provider>;
}

export type DrawerContentProps = HTMLAttributes<HTMLDivElement> & {
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
};

export function DrawerContent({
  className,
  children,
  closeOnOverlayClick = true,
  closeOnEscape = true,
  ...props
}: DrawerContentProps) {
  const { open, setOpen, side, titleId, descriptionId, descriptionPresent, contentRef } =
    useDrawerContext();
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

  if (!open || typeof document === "undefined") return null;

  return createPortal(
    <>
      <div
        className={drawerOverlay}
        data-slot="drawer-overlay"
        onMouseDown={() => {
          if (closeOnOverlayClick) setOpen(false);
        }}
      />
      <div
        {...props}
        ref={contentRef}
        aria-describedby={descriptionPresent ? descriptionId : undefined}
        aria-labelledby={titleId}
        aria-modal="true"
        className={cn(drawerContent({ side }), className)}
        data-side={side}
        data-slot="drawer-content"
        role="dialog"
        tabIndex={-1}
      >
        {children}
      </div>
    </>,
    document.body
  );
}

export type DrawerHeaderProps = HTMLAttributes<HTMLDivElement>;
export function DrawerHeader({ className, ...props }: DrawerHeaderProps) {
  return <div {...props} className={cn(drawerHeader, className)} data-slot="drawer-header" />;
}

export type DrawerTitleProps = HTMLAttributes<HTMLHeadingElement>;
export function DrawerTitle({ className, id, ...props }: DrawerTitleProps) {
  const { titleId } = useDrawerContext();
  return (
    <h2 {...props} className={cn(drawerTitle, className)} data-slot="drawer-title" id={id ?? titleId} />
  );
}

export type DrawerDescriptionProps = HTMLAttributes<HTMLParagraphElement>;
export function DrawerDescription({ className, id, ...props }: DrawerDescriptionProps) {
  const { descriptionId, setDescriptionPresent } = useDrawerContext();
  useEffect(() => {
    setDescriptionPresent(true);
    return () => setDescriptionPresent(false);
  }, [setDescriptionPresent]);

  return (
    <p
      {...props}
      className={cn(drawerDescription, className)}
      data-slot="drawer-description"
      id={id ?? descriptionId}
    />
  );
}

export type DrawerBodyProps = HTMLAttributes<HTMLDivElement>;
export function DrawerBody({ className, ...props }: DrawerBodyProps) {
  return <div {...props} className={cn(drawerBody, className)} data-slot="drawer-body" />;
}

export type DrawerFooterProps = HTMLAttributes<HTMLDivElement>;
export function DrawerFooter({ className, ...props }: DrawerFooterProps) {
  return <div {...props} className={cn(drawerFooter, className)} data-slot="drawer-footer" />;
}

export type DrawerCloseProps = { className?: string; children?: ReactNode };
export function DrawerClose({ className, children = "Close" }: DrawerCloseProps) {
  const { setOpen } = useDrawerContext();
  return (
    <Button
      aria-label={typeof children === "string" ? children : "Close"}
      className={cn(drawerClose, className)}
      data-slot="drawer-close"
      size="sm"
      type="button"
      variant="ghost"
      onClick={() => setOpen(false)}
    >
      {children === "Close" ? "×" : children}
    </Button>
  );
}

/** 측면/상하 패널 오버레이. Dialog와 동일한 focus trap·Esc 패턴을 쓴다. */
export const Drawer = Object.assign(DrawerRoot, {
  Content: DrawerContent,
  Header: DrawerHeader,
  Title: DrawerTitle,
  Description: DrawerDescription,
  Body: DrawerBody,
  Footer: DrawerFooter,
  Close: DrawerClose
});
