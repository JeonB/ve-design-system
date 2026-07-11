import type { ComponentPropsWithoutRef, ElementType } from "react";
import { cn } from "../utils/cn";
import { visuallyHidden } from "./visually-hidden.css";

type VisuallyHiddenProps<T extends ElementType = "span"> = {
  as?: T;
  className?: string;
} & Omit<ComponentPropsWithoutRef<T>, "as" | "className">;

/** 시각적으로는 숨기되 스크린 리더·보조 기술에는 노출되는 콘텐츠. */
export function VisuallyHidden<T extends ElementType = "span">({
  as,
  className,
  ...props
}: VisuallyHiddenProps<T>) {
  const Component = (as ?? "span") as ElementType;

  return <Component {...props} className={cn(visuallyHidden, className)} />;
}
