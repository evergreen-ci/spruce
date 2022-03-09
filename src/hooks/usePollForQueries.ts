import { useState } from "react";
import { pollInterval } from "constants/index";
import { useNetworkStatus } from "./useNetworkStatus";
import { usePageVisibility } from "./usePageVisibility";

type usePollForQueriesType = {
  (
    startPolling: (pollInterval?: number) => void,
    stopPolling: () => void
  ): boolean;
};

/**
 * This hook uses determines polling status based on browser status and page visibility
 * Depending on these values, it calls start and stop polling functions supplied from an
 * Apollo useQuery hook
 * @param startPolling - Function from useQuery that is called when online & visible
 * @param stopPolling - Function from useQuery that is called when offline or not visible
 * @returns boolean - true if polling, false if not polling
 */
export const usePollForQueries: usePollForQueriesType = (
  startPolling,
  stopPolling
) => {
  const [isPolling, setIsPolling] = useState(true);
  const isOnline = useNetworkStatus();
  const isVisible = usePageVisibility();

  // If offline and polling, stop polling.
  if (!isOnline && isPolling) {
    setIsPolling(false);
    stopPolling();
  }

  // If not visible and polling, stop polling.
  if (!isVisible && isPolling) {
    setIsPolling(false);
    stopPolling();
  }

  // If online and visible and not polling, start polling.
  if (isOnline && isVisible && !isPolling) {
    setIsPolling(true);
    startPolling(pollInterval);
  }

  return isPolling;
};
