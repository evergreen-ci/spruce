import { useEffect, useState } from "react";
import { pollInterval } from "constants/index";

type useNetworkStatusType = {
  (onOnline?: (pollInterval?: number) => void, onOffline?: () => void): boolean;
};

/** This hook sets a eventListener to monitor if the browser is offline
 *  Depending on the online status it calls start and stop polling functions supplied
 *  from an Apollo useQuery hook
 *  @param onOnline - Function from useQuery that is called when the browser status is online
 *  @param onOffline - Function from useQuery that is called when the browser status is offline
 *  @returns boolean - Status if the browser is currently offline
 *  */

export const useNetworkStatus: useNetworkStatusType = (onOnline, onOffline) => {
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    const handleOffline = () => {
      setIsOffline(true);
      if (onOffline) onOffline();
    };
    const handleOnline = () => {
      setIsOffline(false);
      if (onOnline) onOnline(pollInterval);
    };
    window.addEventListener("offline", handleOffline);
    window.addEventListener("online", handleOnline);
    return () => {
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("online", handleOnline);
    };
  }, [onOnline, onOffline]);
  return isOffline;
};
