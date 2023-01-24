import { useState } from "react";
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

  const {
    data: projectEventData,
    fetchMore: projectFetchMore,
    previousData: projectPreviousData,
  } = useQuery<ProjectEventLogsQuery, ProjectEventLogsQueryVariables>(
    GET_PROJECT_EVENT_LOGS,
    {
      variables: { identifier, limit },
      errorPolicy: "all",
      skip: isRepo,
      notifyOnNetworkStatusChange: true,
      onCompleted: ({ projectEvents: { count } }) => onCompleted(count),
      onError: (e) => {
        dispatchToast.error(`Unable to fetch events for ${identifier}: ${e}`);
      },
    }
  );

  const {
    data: repoEventData,
    fetchMore: repoFetchMore,
    previousData: repoPreviousData,
  } = useQuery<RepoEventLogsQuery, RepoEventLogsQueryVariables>(
    GET_REPO_EVENT_LOGS,
    {
      variables: { id: identifier, limit },
      errorPolicy: "all",
      skip: !isRepo,
      notifyOnNetworkStatusChange: true,
      onCompleted: ({ repoEvents: { count } }) => onCompleted(count),
      onError: (e) => {
        dispatchToast.error(`Unable to fetch events for ${identifier}: ${e}`);
      },
    }
  );

  const events = isRepo
    ? repoEventData?.repoEvents?.eventLogEntries || []
    : projectEventData?.projectEvents?.eventLogEntries || [];

  const fetchMore = isRepo ? repoFetchMore : projectFetchMore;

  const previousData = isRepo
    ? repoPreviousData?.repoEvents
    : projectPreviousData?.projectEvents;

  // Hide Load More button when event count < limit is returned,
  // or when an additional fetch fails to load more events.
  const onCompleted = (count: number) => {
    const { count: prevCount = 0 } = previousData ?? {};
    if (count - prevCount < limit) {
      setAllEventsFetched(true);
    }
  };

  return { allEventsFetched, events, fetchMore };
};
