import { useState } from "react";
import { pollInterval } from "constants/index";
import { useNetworkStatus } from "./useNetworkStatus";
import { usePageVisibility } from "./usePageVisibility";

type usePollForQueriesType = {
  (
    startPolling: (pollInterval?: number) => void,
    stopPolling: () => void
  ): string;
};

export const usePollForQueries: usePollForQueriesType = (
  startPolling,
  stopPolling
) => {
  const [pollState, setPollState] = useState("started");
  const isOffline = useNetworkStatus();
  const visibility = usePageVisibility();

  // If online and polling, stop polling.
  if (isOffline && pollState === "started") {
    setPollState("stopped");
    stopPolling();
  }

  // If not visible and polling, stop polling.
  if (visibility === "hidden" && pollState === "started") {
    setPollState("stopped");
    stopPolling();
  }

  // If online and visible and not polling, start polling.
  if (!isOffline && visibility === "visible" && pollState === "stopped") {
    setPollState("started");
    startPolling(pollInterval);
  }

  return pollState;
};
