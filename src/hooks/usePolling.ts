import { useState } from "react";
import { ApolloQueryResult, OperationVariables } from "@apollo/client";
import Cookies from "js-cookie";
import { DISABLE_QUERY_POLLING } from "constants/cookies";
import { FASTER_POLL_INTERVAL, DEFAULT_POLL_INTERVAL } from "constants/index";
import { useNetworkStatus } from "./useNetworkStatus";
import { usePageVisibility } from "./usePageVisibility";

interface Props {
  startPolling: (DEFAULT_POLL_INTERVAL?: number) => void;
  stopPolling: () => void;
  refetch: (
    variables?: Partial<OperationVariables>,
  ) => Promise<ApolloQueryResult<any>> | void;
  shouldPollFaster?: boolean;
  initialPollingState?: boolean;
}
type usePollingType = {
  (p: Props): boolean;
};

/**
 * This hook uses determines polling status based on browser status and page visibility.
 * Depending on these values, it calls start and stop polling functions supplied from an
 * Apollo useQuery hook.
 * @param props  - Object containing the following:
 * @param props.stopPolling - Function from useQuery that is called when offline or not visible
 * @param props.refetch - Function from useQuery that is used to refetch data.
 * @param props.shouldPollFaster - Optional boolean to enable increased poll rate.
 * @param props.initialPollingState - Optional boolean to indicate the initial polling state.
 * @param props.startPolling - Function from useQuery that is called when online and visible
 * @returns boolean - true if polling, false if not polling
 */
export const usePolling: usePollingType = ({
  initialPollingState = true,
  refetch,
  shouldPollFaster,
  startPolling,
  stopPolling,
}) => {
  const [pollRate, setPollRate] = useState(
    initialPollingState ? DEFAULT_POLL_INTERVAL : 0,
  );
  const isPolling = pollRate > 0;
  const isOnline = useNetworkStatus();
  const isVisible = usePageVisibility();

  if (Cookies.get(DISABLE_QUERY_POLLING) === "true") {
    return false;
  }

  // If offline or invisible and polling, stop polling.
  if ((!isOnline || !isVisible) && isPolling) {
    setPollRate(0);
    stopPolling();
  }
  // If online and visible and not polling, start polling.
  if (isOnline && isVisible && !isPolling) {
    setPollRate(DEFAULT_POLL_INTERVAL);
    startPolling(DEFAULT_POLL_INTERVAL);
    refetch(); // refresh data when returning to tab
  }
  // If polling and not polling fast enough, poll faster
  if (isPolling && shouldPollFaster && pollRate !== FASTER_POLL_INTERVAL) {
    setPollRate(FASTER_POLL_INTERVAL);
    startPolling(FASTER_POLL_INTERVAL);
  }
  // If polling and not polling slow enough, poll slower
  if (isPolling && !shouldPollFaster && pollRate !== DEFAULT_POLL_INTERVAL) {
    setPollRate(DEFAULT_POLL_INTERVAL);
    startPolling(DEFAULT_POLL_INTERVAL);
  }

  return isPolling;
};
