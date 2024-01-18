import { useEffect, useState } from "react";
import { useActivityAnalytics } from "analytics";

type useNetworkStatusType = {
  (sendAnalytics?: boolean): boolean;
};

/**
 * This hook sets an eventListener to monitor if the browser is online or offline.
 * @param sendAnalytics - whether or not to send an analytics event when the browser goes online
 * @returns boolean - true if online, false if offline
 */
export const useNetworkStatus: useNetworkStatusType = (
  sendAnalytics = false,
) => {
  const [isOnline, setIsOnline] = useState(true);
  const { sendEvent } = useActivityAnalytics();

  const sendOnlineEvent = () => {
    if (sendAnalytics) {
      sendEvent({ name: "Tab Active", status: "online" });
    }
  };

  useEffect(() => {
    const handleOffline = () => {
      // Don't send event because we can't send events if the browser is offline.
      setIsOnline(false);
    };
    const handleOnline = () => {
      sendOnlineEvent();
      setIsOnline(true);
    };
    window.addEventListener("offline", handleOffline);
    window.addEventListener("online", handleOnline);
    return () => {
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("online", handleOnline);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return isOnline;
};
