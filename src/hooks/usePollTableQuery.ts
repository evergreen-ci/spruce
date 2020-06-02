import { useState, useEffect } from "react";
import {
  isNetworkRequestInFlight,
  NetworkStatus,
} from "apollo-client/core/networkStatus";
import { usePrevious } from "hooks";
import { useParams, useLocation } from "react-router-dom";
import { ApolloQueryResult } from "apollo-client";
import isEqual from "lodash.isequal";
interface Params<ApolloQueryVariables, ApolloQueryResultType> {
  networkStatus: NetworkStatus;
  getQueryVariables: (search: string, id?: string) => ApolloQueryVariables;
  refetch: (
    variables?: ApolloQueryVariables
  ) => Promise<ApolloQueryResult<ApolloQueryResultType>>;
  search: string;
}

export const usePollTableQuery = <ApolloQueryVariables, ApolloQueryResultType>({
  networkStatus,
  getQueryVariables,
  refetch,
  search,
}: Params<ApolloQueryVariables, ApolloQueryResultType>): {
  showSkeleton: boolean;
} => {
  const { pathname } = useLocation();
  const [initialPathname] = useState(pathname);
  const { id: resourceId } = useParams<{ id: string }>();
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
    if (pathname !== initialPathname) {
      clearInterval(intervalId);
    }
  }, [pathname, initialPathname, intervalId]);

  useEffect(() => {
    if (
      intervalId &&
      !isEqual(currentQueryVariables, prevQueryVariables) &&
      pathname === initialPathname
    ) {
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
    pathname,
    initialPathname,
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
    refetch(queryVariables);
  }, pollInterval);
  setIntervalId(intervalId);
};
