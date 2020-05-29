import { useState, useEffect } from "react";
import {
  isNetworkRequestInFlight,
  NetworkStatus,
} from "apollo-client/core/networkStatus";
import { usePrevious } from "hooks";
import { useLocation, useHistory, useParams } from "react-router-dom";
import { ApolloQueryResult } from "apollo-client";
import isEqual from "lodash.isequal";

export const usePollTableQuery = <ApolloQueryVariables, ApolloQueryResultType>({
  networkStatus,
  getQueryVariables,
  refetch,
}: {
  networkStatus: NetworkStatus;
  getQueryVariables: (search: string, id?: string) => ApolloQueryVariables;
  refetch: (
    variables?: ApolloQueryVariables
  ) => Promise<ApolloQueryResult<ApolloQueryResultType>>;
}): { showSkeleton: boolean } => {
  const { id: resourceId } = useParams<{ id: string }>();
  const { listen } = useHistory();
  const { search } = useLocation();
  const [intervalId, setIntervalId] = useState<number>();
  const [queryVarDiffOccured, setQueryVarDiffOccured] = useState(false);
  const currentQueryVariables = getQueryVariables(search, resourceId);
  const prevQueryVariables = usePrevious(currentQueryVariables);
  const isLoading = isNetworkRequestInFlight(networkStatus);

  useEffect(() => {
    if (!isEqual(currentQueryVariables, prevQueryVariables)) {
      setQueryVarDiffOccured(true);
    }
  }, [currentQueryVariables, prevQueryVariables, setQueryVarDiffOccured]);

  useEffect(() => {
    if (!isLoading) {
      setQueryVarDiffOccured(false);
    }
  }, [isLoading, setQueryVarDiffOccured]);

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

  useEffect(() => {
    const unregisterListen = listen(async (loc) => {
      clearInterval(intervalId);
      try {
        refetch(getQueryVariables(loc.search, resourceId));
      } catch (e) {
        return;
      }
      pollQuery({
        search: loc.search,
        resourceId,
        refetch,
        setIntervalId,
        getQueryVariables,
      });
    });
    return unregisterListen;
  }, [
    networkStatus,
    refetch,
    listen,
    intervalId,
    resourceId,
    getQueryVariables,
  ]);

  return {
    showSkeleton: queryVarDiffOccured,
  };
};

const pollInterval = 5000;

const pollQuery = ({
  search,
  resourceId,
  refetch,
  setIntervalId,
  getQueryVariables,
}) => {
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
