import { useEffect, useState } from "react";

/**
 * This hook sets a eventListener to monitor if the tab is visible (being viewed by the user).
 * @returns string - one of "visible" or "hidden"
 */
export const usePageVisibility = () => {
  const [visibility, setVisibility] = useState("visible");

  useEffect(() => {
    const handleVisibilityChange = () => {
      setVisibility(document.visibilityState);
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  return visibility;
};
