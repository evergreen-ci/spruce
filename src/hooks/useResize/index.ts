import { useEffect, useState } from "react";

type UseResizeOptions = {
  onResize?: () => void;
};

/**
 * `useResize` determines if the window is currently being resized or not.
 * @param options - An optional object containing options for the hook.
 * @param options.onResize - An optional callback function that will be called during a resize event.
 * @returns a boolean indicating whether the window is being resized or not
 */
export const useResize = (options?: UseResizeOptions) => {
  const [isResizing, setIsResizing] = useState(false);

  useEffect(() => {
    let resizeTimer: ReturnType<typeof setTimeout>;

    const onResize = () => {
      setIsResizing(true);
      options?.onResize?.();

      // Set a timeout which will execute when the resize event ends.
      if (resizeTimer) {
        clearTimeout(resizeTimer);
      }
      resizeTimer = setTimeout(() => {
        setIsResizing(false);
      }, 500);
    };

    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      clearTimeout(resizeTimer);
    };
  }, [options]);

  return isResizing;
};
