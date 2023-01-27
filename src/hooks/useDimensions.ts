import { MutableRefObject, useLayoutEffect, useMemo, useState } from "react";

interface DimensionState {
  width: number;
  height: number;
}

export const useDimensions = (ref: MutableRefObject<HTMLElement>) => {
  const [state, setState] = useState<DimensionState>({ width: 0, height: 0 });

  const observer = useMemo(
    () =>
      new (window as any).ResizeObserver((entries) => {
        const { width, height } = entries[0]?.contentRect ?? {};
        setState({ width, height });
      }),
    []
  );

  useLayoutEffect(() => {
    if (!ref?.current) return;
    observer.observe(ref.current);
    return () => {
      observer.disconnect();
    };
  }, [ref]);

  return state;
};
