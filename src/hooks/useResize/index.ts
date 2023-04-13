import { useEffect, useState } from "react";

/**
 * `useResize` determines if the window is currently being resized or not.
 * @returns a boolean indicating whether the window is being resized or not
 */
export const useResize = () => {
  const [isResizing, setIsResizing] = useState(false);

  useEffect(() => {
    let resizeTimer: ReturnType<typeof setTimeout>;

    const onResize = () => {
      setIsResizing(true);

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
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return isResizing;
};
