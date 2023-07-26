import { useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
import { useToastContext } from "context/toast";
import {
  ProjectEventLogsQuery,
  ProjectEventLogsQueryVariables,
  RepoEventLogsQuery,
  RepoEventLogsQueryVariables,
} from "gql/generated/types";
import { GET_PROJECT_EVENT_LOGS, GET_REPO_EVENT_LOGS } from "gql/queries";

export const useEvents = (
  identifier: string,
  isRepo: boolean,
  limit: number
) => {
  const dispatchToast = useToastContext();

  const [allEventsFetched, setAllEventsFetched] = useState(false);
  const [prevCount, setPrevCount] = useState(0);

  // Hide Load More button when event count < limit is returned,
  // or when an additional fetch fails to load more events.
  const onCompleted = (count: number) => {
    if (count - prevCount < limit) {
      setAllEventsFetched(true);
    }
  };

  const {
    data: projectEventData,
    fetchMore: projectFetchMore,
    previousData: projectPreviousData,
  } = useQuery<ProjectEventLogsQuery, ProjectEventLogsQueryVariables>(
    GET_PROJECT_EVENT_LOGS,
    {
      errorPolicy: "all",
      notifyOnNetworkStatusChange: true,
      onCompleted: ({ projectEvents: { count } }) => onCompleted(count),
      onError: (e) => {
        dispatchToast.error(`Unable to fetch events for ${identifier}: ${e}`);
      },
      skip: isRepo,
      variables: { identifier, limit },
    }
  );

  const {
    data: repoEventData,
    fetchMore: repoFetchMore,
    previousData: repoPreviousData,
  } = useQuery<RepoEventLogsQuery, RepoEventLogsQueryVariables>(
    GET_REPO_EVENT_LOGS,
    {
      errorPolicy: "all",
      notifyOnNetworkStatusChange: true,
      onCompleted: ({ repoEvents: { count } }) => onCompleted(count),
      onError: (e) => {
        dispatchToast.error(`Unable to fetch events for ${identifier}: ${e}`);
      },
      skip: !isRepo,
      variables: { id: identifier, limit },
    }
  );

  const events = isRepo
    ? repoEventData?.repoEvents?.eventLogEntries || []
    : projectEventData?.projectEvents?.eventLogEntries || [];

  const fetchMore = isRepo ? repoFetchMore : projectFetchMore;

  const previousData = isRepo
    ? repoPreviousData?.repoEvents
    : projectPreviousData?.projectEvents;

  useEffect(() => {
    setPrevCount(previousData?.count ?? 0);
  }, [previousData]);

  return { allEventsFetched, events, fetchMore };
};
