import { useState } from "react";
import { usePollingAnalytics } from "analytics";
import { pollInterval } from "constants/index";
import { useNetworkStatus } from "./useNetworkStatus";
import { usePageVisibility } from "./usePageVisibility";

type usePollingType = {
  (
    startPolling: (pollInterval?: number) => void,
    stopPolling: () => void,
    initialPollingState?: boolean
  ): boolean;
};

/**
 * This hook uses determines polling status based on browser status and page visibility.
 * Depending on these values, it calls start and stop polling functions supplied from an
 * Apollo useQuery hook.
 * @param startPolling - Function from useQuery that is called when online & visible
 * @param stopPolling - Function from useQuery that is called when offline, not visible or polling is disabled
 * @returns boolean - true if polling, false if not polling
 */
export const usePolling: usePollingType = (
  startPolling,
  stopPolling,
  initialPollingState = true
) => {
  const { sendEvent } = usePollingAnalytics();

  const [isPolling, setIsPolling] = useState(initialPollingState);
  const isOnline = useNetworkStatus();
  const isVisible = usePageVisibility();

  if (!isOnline && isPolling && stopPolling) {
    // If offline and polling, stop polling.
    sendEvent({ name: "Tab Not Active", status: "offline" });
    setIsPolling(false);
    stopPolling();
  }
  // If not visible and polling, stop polling.
  if (!isVisible && isPolling && stopPolling) {
    sendEvent({ name: "Tab Not Active", status: "hidden" });
    setIsPolling(false);
    stopPolling();
  }

  // If online and visible and not polling, start polling.
  if (isOnline && isVisible && !isPolling && startPolling) {
    sendEvent({ name: "Tab Active" });
    setIsPolling(true);
    startPolling(pollInterval);
  }

  return isPolling;
};
