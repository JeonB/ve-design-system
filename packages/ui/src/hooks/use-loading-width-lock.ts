import { useLayoutEffect, useRef, useState, type CSSProperties, type RefObject } from "react";

type UseLoadingWidthLockOptions = {
  loading: boolean;
  style?: CSSProperties;
};

type UseLoadingWidthLockResult = {
  ref: RefObject<HTMLElement | null>;
  style?: CSSProperties;
};

/**
 * 로딩 시작 시점의 offsetWidth를 minWidth로 고정해
 * 스피너 표시로 인한 버튼 너비 변화(레이아웃 시프트)를 방지한다.
 */
export function useLoadingWidthLock({
  loading,
  style
}: UseLoadingWidthLockOptions): UseLoadingWidthLockResult {
  const ref = useRef<HTMLElement | null>(null);
  const [lockedWidth, setLockedWidth] = useState<number | undefined>(undefined);

  useLayoutEffect(() => {
    if (!loading) {
      setLockedWidth(undefined);
      return;
    }

    const node = ref.current;
    if (!node || lockedWidth !== undefined) return;

    setLockedWidth(node.offsetWidth);
  }, [loading, lockedWidth]);

  if (!lockedWidth) {
    return { ref, style };
  }

  return {
    ref,
    style: { minWidth: lockedWidth, ...(style ?? {}) }
  };
}
