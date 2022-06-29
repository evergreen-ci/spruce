import { useEffect, useState } from "react";
import { usePollingAnalytics } from "analytics";

type usePageVisibilityType = {
  (sendAnalytics?: boolean): boolean;
};

/**
 * This hook sets an eventListener to monitor if the tab is visible or hidden.
 * @returns boolean - true if visible, false if hidden
 */
export const usePageVisibility: usePageVisibilityType = (
  sendAnalytics = false
) => {
  const [isVisible, setIsVisible] = useState(true);
  const { sendEvent } = usePollingAnalytics();

  const sendHiddenEvent = () => {
    if (sendAnalytics) {
      sendEvent({ name: "Tab Not Active", status: "hidden" });
    }
  };

  const sendVisibleEvent = () => {
    if (sendAnalytics) {
      sendEvent({ name: "Tab Active", status: "visible" });
    }
  };

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        sendVisibleEvent();
        setIsVisible(true);
      } else {
        sendHiddenEvent();
        setIsVisible(false);
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return isVisible;
};
