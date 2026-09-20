import type { CSSProperties, HTMLAttributes } from "react";
import { cn } from "../utils/cn";
import { skeletonStyles, type SkeletonVariant } from "./skeleton.css";

export type { SkeletonVariant };

export type SkeletonProps = HTMLAttributes<HTMLDivElement> & {
  variant?: SkeletonVariant;
  width?: CSSProperties["width"];
  height?: CSSProperties["height"];
};

/** 콘텐츠 로딩 플레이스홀더. aria-hidden이며 주변 텍스트로 로딩을 안내한다. */
export function Skeleton({
  variant = "rect",
  width,
  height,
  className,
  style,
  ...props
}: SkeletonProps) {
  return (
    <div
      {...props}
      aria-hidden="true"
      className={cn(skeletonStyles({ variant }), className)}
      data-slot="skeleton"
      data-variant={variant}
      style={{ width, height, ...style }}
    />
  );
}
