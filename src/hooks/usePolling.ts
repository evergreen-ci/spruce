import { useState } from "react";
import { ApolloQueryResult, OperationVariables } from "@apollo/client";
import Cookies from "js-cookie";
import { DISABLE_QUERY_POLLING } from "constants/cookies";
import { pollInterval } from "constants/index";
import { useNetworkStatus } from "./useNetworkStatus";
import { usePageVisibility } from "./usePageVisibility";

type usePollingType = {
  (
    startPolling: (pollInterval?: number) => void,
    stopPolling: () => void,
    refetch?: (
      variables?: Partial<OperationVariables>
    ) => Promise<ApolloQueryResult<any>> | void,
    initialPollingState?: boolean
  ): boolean;
};

/**
 * This hook uses determines polling status based on browser status and page visibility.
 * Depending on these values, it calls start and stop polling functions supplied from an
 * Apollo useQuery hook.
 * @param startPolling - Function from useQuery that is called when online & visible
 * @param stopPolling - Function from useQuery that is called when offline or not visible
 * @param refetch - Optional function from useQuery that can be used to refetch data
 * @param initialPollingState - Optional boolean to indicate the initial polling state
 * @returns boolean - true if polling, false if not polling
 */
export const usePolling: usePollingType = (
  startPolling,
  stopPolling,
  refetch = () => {},
  initialPollingState = true
) => {
  const [isPolling, setIsPolling] = useState(initialPollingState);
  const isOnline = useNetworkStatus();
  const isVisible = usePageVisibility();

  if (Cookies.get(DISABLE_QUERY_POLLING) === "true") {
    return false;
  }

  // If offline and polling, stop polling.
  if (!isOnline && isPolling && stopPolling) {
    setIsPolling(false);
    stopPolling();
  }
  // If not visible and polling, stop polling.
  if (!isVisible && isPolling && stopPolling) {
    setIsPolling(false);
    stopPolling();
  }
  // If online and visible and not polling, start polling.
  if (isOnline && isVisible && !isPolling && startPolling) {
    setIsPolling(true);
    startPolling(pollInterval);
    refetch(); // refresh data when returning to tab
  }

  return isPolling;
};
