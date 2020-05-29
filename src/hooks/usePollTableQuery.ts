import { useState, useEffect } from "react";
import {
  isNetworkRequestInFlight,
  NetworkStatus,
} from "apollo-client/core/networkStatus";
import { usePrevious } from "hooks";
import { useLocation, useHistory, useParams } from "react-router-dom";
import { ApolloQueryResult } from "apollo-client";

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
  const isLoading = isNetworkRequestInFlight(networkStatus);
  const [queryVarDiffOccured, setQueryVarDiffOccured] = useState(false);
  const currentQueryVariables = getQueryVariables(search, resourceId);
  const prevQueryVariables = usePrevious(currentQueryVariables);
  useEffect(() => {
    if (
      JSON.stringify(currentQueryVariables) !==
      JSON.stringify(prevQueryVariables)
    ) {
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
      const queryVariables = getQueryVariables(search, resourceId);
      const id = window.setInterval(() => {
        refetch(queryVariables);
      }, pollInterval);
      setIntervalId(id);
    }
    return () => clearInterval(intervalId);
  }, [intervalId, refetch, search, getQueryVariables, resourceId]);

  useEffect(() => {
    const unregisterListen = listen(async (loc) => {
      try {
        const queryVariables = getQueryVariables(loc.search, resourceId);
        refetch(queryVariables);
        clearInterval(intervalId);
        const id = window.setInterval(() => {
          refetch(queryVariables);
        }, pollInterval);
        setIntervalId(id);
      } catch (e) {
        // empty block
      }
    });
    return () => {
      unregisterListen();
    };
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

const pollInterval = 3000;
