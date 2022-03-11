import { useEffect, useState } from "react";

/**
 * This hook sets an eventListener to monitor if the browser is online or offline.
 * @returns boolean - true if online, false if offline
 */
export const useNetworkStatus = () => {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    const handleOffline = () => {
      setIsOnline(false);
    };
    const handleOnline = () => {
      setIsOnline(true);
    };
    window.addEventListener("offline", handleOffline);
    window.addEventListener("online", handleOnline);
    return () => {
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("online", handleOnline);
    };
  }, []);

  return isOnline;
};
