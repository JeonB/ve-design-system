import { useState, type HTMLAttributes, type ImgHTMLAttributes, type ReactNode } from "react";
import { cn } from "../utils/cn";
import {
  avatarFallback,
  avatarImage,
  avatarStyles,
  type AvatarSize
} from "./avatar.css";

export type { AvatarSize };

export type AvatarProps = HTMLAttributes<HTMLSpanElement> & {
  src?: string;
  alt: string;
  fallback?: ReactNode;
  size?: AvatarSize;
  imgProps?: Omit<ImgHTMLAttributes<HTMLImageElement>, "src" | "alt">;
};

function initialsFromAlt(alt: string) {
  const parts = alt.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) {
    return "?";
  }
  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }
  return `${parts[0][0] ?? ""}${parts[1][0] ?? ""}`.toUpperCase();
}

/** 사용자·엔티티 아바타. 이미지 로드 실패 시 fallback/이니셜을 표시한다. */
export function Avatar({
  src,
  alt,
  fallback,
  size = "md",
  className,
  imgProps,
  ...props
}: AvatarProps) {
  const [failed, setFailed] = useState(false);
  const showImage = Boolean(src) && !failed;
  const fallbackContent = fallback ?? initialsFromAlt(alt);
  const decorative = alt === "";

  return (
    <span
      {...props}
      aria-hidden={decorative ? true : undefined}
      aria-label={!showImage && !decorative ? alt : undefined}
      className={cn(avatarStyles({ size }), className)}
      data-size={size}
      data-slot="avatar"
      role={!showImage && !decorative ? "img" : undefined}
    >
      {showImage ? (
        <img
          {...imgProps}
          alt={alt}
          className={cn(avatarImage, imgProps?.className)}
          onError={(event) => {
            setFailed(true);
            imgProps?.onError?.(event);
          }}
          src={src}
        />
      ) : (
        <span aria-hidden="true" className={avatarFallback}>
          {fallbackContent}
        </span>
      )}
    </span>
  );
}
