import {
  createContext,
  useCallback,
  useContext,
  useId,
  useMemo,
  useRef,
  useState,
  type ButtonHTMLAttributes,
  type HTMLAttributes,
  type KeyboardEvent,
  type ReactNode
} from "react";
import { cn } from "../utils/cn";
import { tabsContent, tabsList, tabsRoot, tabsTrigger } from "./tabs.css";

type TabsContextValue = {
  value: string;
  setValue: (value: string) => void;
  baseId: string;
};

const TabsContext = createContext<TabsContextValue | null>(null);

function useTabsContext() {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error("[@ve/ui Tabs] 하위 컴포넌트는 Tabs 안에서만 사용할 수 있습니다.");
  }
  return context;
}

function triggerId(baseId: string, value: string) {
  return `${baseId}-tab-${value}`;
}

function panelId(baseId: string, value: string) {
  return `${baseId}-panel-${value}`;
}

export type TabsProps = HTMLAttributes<HTMLDivElement> & {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  children: ReactNode;
};

function TabsRoot({
  value,
  defaultValue = "",
  onValueChange,
  className,
  children,
  ...props
}: TabsProps) {
  const isControlled = value !== undefined;
  const [uncontrolled, setUncontrolled] = useState(defaultValue);
  const resolvedValue = isControlled ? value : uncontrolled;
  const baseId = useId();

  const setValue = useCallback(
    (next: string) => {
      if (!isControlled) setUncontrolled(next);
      onValueChange?.(next);
    },
    [isControlled, onValueChange]
  );

  const context = useMemo(
    () => ({ value: resolvedValue, setValue, baseId }),
    [resolvedValue, setValue, baseId]
  );

  return (
    <TabsContext.Provider value={context}>
      <div {...props} className={cn(tabsRoot, className)} data-slot="tabs">
        {children}
      </div>
    </TabsContext.Provider>
  );
}

export type TabsListProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
};

export function TabsList({ className, children, onKeyDown, ...props }: TabsListProps) {
  const listRef = useRef<HTMLDivElement | null>(null);

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    onKeyDown?.(event);
    if (event.defaultPrevented) return;

    const list = listRef.current;
    if (!list) return;

    const tabs = Array.from(
      list.querySelectorAll<HTMLButtonElement>('[role="tab"]:not(:disabled)')
    );
    if (tabs.length === 0) return;

    const currentIndex = tabs.findIndex((tab) => tab === document.activeElement);
    if (currentIndex < 0) return;

    let nextIndex = currentIndex;
    switch (event.key) {
      case "ArrowRight":
        nextIndex = (currentIndex + 1) % tabs.length;
        break;
      case "ArrowLeft":
        nextIndex = (currentIndex - 1 + tabs.length) % tabs.length;
        break;
      case "Home":
        nextIndex = 0;
        break;
      case "End":
        nextIndex = tabs.length - 1;
        break;
      default:
        return;
    }

    event.preventDefault();
    tabs[nextIndex]?.focus();
    tabs[nextIndex]?.click();
  };

  return (
    <div
      {...props}
      ref={listRef}
      className={cn(tabsList, className)}
      data-slot="tabs-list"
      role="tablist"
      onKeyDown={handleKeyDown}
    >
      {children}
    </div>
  );
}

export type TabsTriggerProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  value: string;
};

export function TabsTrigger({
  value,
  className,
  disabled,
  children,
  onClick,
  ...props
}: TabsTriggerProps) {
  const tabs = useTabsContext();
  const selected = tabs.value === value;

  return (
    <button
      {...props}
      aria-controls={panelId(tabs.baseId, value)}
      aria-selected={selected}
      className={cn(tabsTrigger({ active: selected }), className)}
      data-slot="tabs-trigger"
      data-state={selected ? "active" : "inactive"}
      disabled={disabled}
      id={triggerId(tabs.baseId, value)}
      role="tab"
      tabIndex={selected ? 0 : -1}
      type="button"
      onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented && !disabled) {
          tabs.setValue(value);
        }
      }}
    >
      {children}
    </button>
  );
}

export type TabsContentProps = HTMLAttributes<HTMLDivElement> & {
  value: string;
  children: ReactNode;
};

export function TabsContent({ value, className, children, ...props }: TabsContentProps) {
  const tabs = useTabsContext();
  const selected = tabs.value === value;

  if (!selected) {
    return null;
  }

  return (
    <div
      {...props}
      aria-labelledby={triggerId(tabs.baseId, value)}
      className={cn(tabsContent, className)}
      data-slot="tabs-content"
      id={panelId(tabs.baseId, value)}
      role="tabpanel"
      tabIndex={0}
    >
      {children}
    </div>
  );
}

/** 섹션 탭 내비. controlled/uncontrolled value와 화살표 키 로빙을 지원한다. */
export const Tabs = Object.assign(TabsRoot, {
  List: TabsList,
  Trigger: TabsTrigger,
  Content: TabsContent
});
