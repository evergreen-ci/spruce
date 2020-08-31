import { useState, useEffect, Dispatch, SetStateAction } from "react";
import { ApolloQueryResult } from "@apollo/client";
import {
  isNetworkRequestInFlight,
  NetworkStatus,
} from "@apollo/client/core/networkStatus";
import isEqual from "lodash.isequal";
import { useParams } from "react-router-dom";
import { pollInterval } from "constants/index";
import { usePrevious } from "hooks";

interface Params<ApolloQueryVariables, ApolloQueryResultType> {
  networkStatus: NetworkStatus;
  getQueryVariables: (search: string, id?: string) => ApolloQueryVariables;
  refetch: (
    variables?: ApolloQueryVariables
  ) => Promise<ApolloQueryResult<ApolloQueryResultType>>;
  search: string;
  isOffline?: boolean;
}

export const usePollQuery = <ApolloQueryVariables, ApolloQueryResultType>({
  networkStatus,
  getQueryVariables,
  refetch,
  search,
  isOffline,
}: Params<ApolloQueryVariables, ApolloQueryResultType>): {
  showSkeleton: boolean;
} => {
  const { id: resourceId } = useParams<{ id: string }>();
  const [intervalId, setIntervalId] = useState<number>();
  const [prevOffline, setPrevOffline] = useState<boolean>(isOffline); // This is used to keep track if we transitioned from offline to online
  // this variable is true when query variables have changed and the query is loading
  // this means the user interacted with the table/list filters, sort, or page
  const [queryVarDiffOccured, setQueryVarDiffOccured] = useState(false);
  const currentQueryVariables = getQueryVariables(search, resourceId);
  const prevQueryVariables = usePrevious(currentQueryVariables);
  const isLoading = isNetworkRequestInFlight(networkStatus);

  // detects when query variables have changed
  useEffect(() => {
    if (!isEqual(currentQueryVariables, prevQueryVariables)) {
      setQueryVarDiffOccured(true);
    }
  }, [currentQueryVariables, prevQueryVariables, setQueryVarDiffOccured]);

  // when loading goes from true to false, do not show the loading skeleton
  useEffect(() => {
    if (!isLoading) {
      setQueryVarDiffOccured(false);
    }
  }, [isLoading, setQueryVarDiffOccured]);

  // this is to initiate polling for the first time after useQuery
  // submits it's first request and is not dependent on URL changes
  useEffect(() => {
    if (!intervalId) {
      pollQuery({
        setIntervalId,
        refetch,
        search,
        getQueryVariables,
        resourceId,
      });
    }
    return () => clearInterval(intervalId);
  }, [
    intervalId,
    refetch,
    search,
    getQueryVariables,
    resourceId,
    setIntervalId,
  ]);

  // reponsible for clearing the current polling query and
  // starting a new polling query based on new query variables
  useEffect(() => {
    if (intervalId && !isEqual(currentQueryVariables, prevQueryVariables)) {
      clearInterval(intervalId);
      refetch(currentQueryVariables);
      pollQuery({
        search,
        resourceId,
        refetch,
        setIntervalId,
        getQueryVariables,
      });
    }
  }, [
    currentQueryVariables,
    prevQueryVariables,
    networkStatus,
    refetch,
    intervalId,
    resourceId,
    getQueryVariables,
    search,
  ]);

  // Responsible for clearing the refresh interval if the browser is offline
  useEffect(() => {
    if (isOffline) {
      clearInterval(intervalId);
    } else if (prevOffline !== isOffline) {
      clearInterval(intervalId);
      pollQuery({
        search,
        resourceId,
        refetch,
        setIntervalId,
        getQueryVariables,
      });
      setPrevOffline(isOffline);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    isOffline,
    search,
    resourceId,
    refetch,
    setIntervalId,
    getQueryVariables,
  ]);
  return {
    showSkeleton: queryVarDiffOccured,
  };
};

interface PollQueryParams<ApolloQueryVariables, ApolloQueryResultType> {
  resourceId: string;
  setIntervalId: Dispatch<SetStateAction<number>>;
  getQueryVariables: (search: string, id?: string) => ApolloQueryVariables;
  refetch: (
    variables?: ApolloQueryVariables
  ) => Promise<ApolloQueryResult<ApolloQueryResultType>>;
  search: string;
}
const pollQuery = <V, T>({
  search,
  resourceId,
  refetch,
  setIntervalId,
  getQueryVariables,
}: PollQueryParams<V, T>) => {
  const queryVariables = getQueryVariables(search, resourceId);
  const intervalId = window.setInterval(() => {
    try {
      refetch(queryVariables);
    } catch {
      clearInterval(intervalId);
    }
  }, pollInterval);
  setIntervalId(intervalId);
};
