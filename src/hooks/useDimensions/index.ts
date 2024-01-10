import { MutableRefObject, useLayoutEffect, useMemo, useState } from "react";

interface DimensionState {
  width: number;
  height: number;
}

/**
 * useDimensions returns the pixel width and height of a given ref.
 * The ref should be applied to an HTML Element.
 * @param ref The ref of the element to track the dimensions of.
 * @returns An object containing the current height and width of the ref.
 */
export const useDimensions = (ref: MutableRefObject<HTMLElement>) => {
  const [state, setState] = useState<DimensionState>({ width: 0, height: 0 });

  const observer = useMemo(
    () =>
      new ResizeObserver((entries) => {
        requestAnimationFrame(() => {
          const { height, width } = entries[0]?.contentRect ?? {};
          setState({ width, height });
        });
      }),
    [],
  );

  useLayoutEffect(() => {
    if (!ref?.current) return;
    observer.observe(ref.current);
    return () => {
      observer.disconnect();
    };
  }, [ref]); // eslint-disable-line react-hooks/exhaustive-deps

  return state;
};
