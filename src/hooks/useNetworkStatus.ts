import { useEffect, useState } from "react";
import { usePollingAnalytics } from "analytics";

type useNetworkStatusType = {
  (sendAnalytics?: boolean): boolean;
};

/**
 * This hook sets an eventListener to monitor if the browser is online or offline.
 * @returns boolean - true if online, false if offline
 */
export const useNetworkStatus: useNetworkStatusType = (
  sendAnalytics = false
) => {
  const [isOnline, setIsOnline] = useState(true);
  const { sendEvent } = usePollingAnalytics();

  const sendOfflineEvent = () => {
    if (sendAnalytics) {
      sendEvent({ name: "Tab Not Active", status: "offline" });
    }
  };

  const sendOnlineEvent = () => {
    if (sendAnalytics) {
      sendEvent({ name: "Tab Active", status: "online" });
    }
  };

  useEffect(() => {
    const handleOffline = () => {
      sendOfflineEvent();
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
