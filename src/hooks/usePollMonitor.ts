import { useEffect, useState } from "react";
import { pollInterval } from "constants/index";

interface UsePollMonitorType {
  (
    startPolling?: (pollInterval: number) => void,
    stopPolling?: () => void
  ): boolean;
}

/** This hook sets a eventListener to monitor if the browser is offline
 *  Depending on the online status it calls start and stop polling functions supplied
 *  from an Apollo useQuery hook
 *  @param startPolling - Function from useQuery that is called when the browser status is online
 *  @param stopPolling - Function from useQuery that is called when the browser status is offline
 *  @returns boolean - Status if the browser is currently offline
 *  */

export const usePollMonitor: UsePollMonitorType = (
  startPolling,
  stopPolling
) => {
  const [isOffline, setIsOffline] = useState(false);
  useEffect(() => {
    window.addEventListener("offline", () => {
      setIsOffline(true);
      if (stopPolling) stopPolling();
    });
    window.addEventListener("online", () => {
      setIsOffline(false);
      if (startPolling) startPolling(pollInterval);
    });
    return () => {
      window.removeEventListener("offline", () => undefined);
      window.removeEventListener("online", () => undefined);
    };
  }, [startPolling, stopPolling]);
  return isOffline;
};
