import { useEffect, useRef } from "react";

/**
 * `usePrevious` is a custom hook that returns the previous value of a given value
 * @param value
 * @param initialValue
 * @returns - the previous value
 */
export const usePrevious = <T>(state: T): T | undefined => {
  const ref = useRef<T>();
  useEffect(() => {
    ref.current = state;
  }, [state]);
  return ref.current;
};
