import { useEffect } from "react";
import { pollInterval } from "constants/index";

interface UsePollMonitorType {
  startPolling: (pollInterval: number) => void;
  stopPolling: () => void;
}
export const usePollMonitor = (
  startPolling: (pollInterval: number) => void,
  stopPolling: () => void
) =>
  useEffect(() => {
    window.addEventListener("offline", () => {
      stopPolling();
    });
    window.addEventListener("online", () => {
      startPolling(pollInterval);
    });
    return () => {
      window.removeEventListener("offline", () => undefined);
      window.removeEventListener("online", () => undefined);
    };
  }, [startPolling, stopPolling]);
