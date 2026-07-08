import type { ComponentPropsWithoutRef, ElementType } from "react";
import { cn } from "../utils/cn";
import { visuallyHidden } from "./visually-hidden.css";

type VisuallyHiddenProps<T extends ElementType = "span"> = {
  as?: T;
  className?: string;
} & Omit<ComponentPropsWithoutRef<T>, "as" | "className">;

export function VisuallyHidden<T extends ElementType = "span">({
  as,
  className,
  ...props
}: VisuallyHiddenProps<T>) {
  const Component = (as ?? "span") as ElementType;

  return <Component {...props} className={cn(visuallyHidden, className)} />;
}
