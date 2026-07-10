import { useLayoutEffect, useRef, useState, type CSSProperties, type RefObject } from "react";

type UseLoadingWidthLockOptions = {
  loading: boolean;
  style?: CSSProperties;
};

type UseLoadingWidthLockResult = {
  ref: RefObject<HTMLElement | null>;
  style?: CSSProperties;
};

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
