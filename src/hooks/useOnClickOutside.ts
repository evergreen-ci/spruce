import { useEffect } from "react";

export const useOnClickOutside = (
  refs: Array<React.RefObject<HTMLElement>>,
  cb: (isFocused: boolean) => void,
  isOpen: boolean
): void => {
  useEffect(() => {
    function handleClickOutside(event): void {
      if (!isOpen) {
        return;
      }
      // Array.some returns true if some value within array satisfies condition, false otherwise
      const isFocused = refs.some((ref) =>
        ref.current!.contains(event.target as Node)
      );
      cb(isFocused);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return (): void => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [cb, refs, isOpen]);
};
