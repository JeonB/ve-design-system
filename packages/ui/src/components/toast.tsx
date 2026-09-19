import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode
} from "react";
import { createPortal } from "react-dom";
import { cn } from "../utils/cn";
import {
  toastDescription,
  toastItem,
  toastTitle,
  toastViewport,
  type ToastVariant
} from "./toast.css";

export type { ToastVariant };

export type ToastInput = {
  title: string;
  description?: string;
  variant?: ToastVariant;
  duration?: number;
};

type ToastRecord = ToastInput & {
  id: string;
};

type ToastContextValue = {
  toast: (input: ToastInput) => string;
  dismiss: (id: string) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);
const MAX_TOASTS = 3;

export type ToastProviderProps = {
  children: ReactNode;
};

/** 앱 루트에 두고 useToast로 토스트를 띄운다. */
export function ToastProvider({ children }: ToastProviderProps) {
  const [toasts, setToasts] = useState<ToastRecord[]>([]);

  const dismiss = useCallback((id: string) => {
    setToasts((current) => current.filter((item) => item.id !== id));
  }, []);

  const toast = useCallback((input: ToastInput) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    setToasts((current) => {
      const next = [...current, { ...input, id }];
      return next.length > MAX_TOASTS ? next.slice(next.length - MAX_TOASTS) : next;
    });
    return id;
  }, []);

  const value = useMemo(() => ({ toast, dismiss }), [toast, dismiss]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      {typeof document !== "undefined"
        ? createPortal(
            <div className={toastViewport} data-slot="toast-viewport">
              {toasts.map((item) => (
                <ToastCard key={item.id} item={item} onDismiss={dismiss} />
              ))}
            </div>,
            document.body
          )
        : null}
    </ToastContext.Provider>
  );
}

function ToastCard({
  item,
  onDismiss
}: {
  item: ToastRecord;
  onDismiss: (id: string) => void;
}) {
  const variant = item.variant ?? "neutral";
  const duration = item.duration ?? 4000;

  useEffect(() => {
    if (duration <= 0) return;
    const timer = window.setTimeout(() => onDismiss(item.id), duration);
    return () => window.clearTimeout(timer);
  }, [duration, item.id, onDismiss]);

  return (
    <div
      className={cn(toastItem({ variant }))}
      data-slot="toast"
      data-variant={variant}
      role={variant === "danger" ? "alert" : "status"}
    >
      <p className={toastTitle}>{item.title}</p>
      {item.description ? <p className={toastDescription}>{item.description}</p> : null}
    </div>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("[@ve/ui ToastProvider] useToast는 ToastProvider 안에서만 사용할 수 있습니다.");
  }
  return context;
}
