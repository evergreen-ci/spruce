import { useEffect } from "react";
import { useQuery } from "@apollo/client";
import { EVENT_LIMIT, useEvents } from "components/Settings/EventLog";
import { useToastContext } from "context/toast";
import {
  ProjectEventLogsQuery,
  ProjectEventLogsQueryVariables,
  RepoEventLogsQuery,
  RepoEventLogsQueryVariables,
} from "gql/generated/types";
import { PROJECT_EVENT_LOGS, REPO_EVENT_LOGS } from "gql/queries";

export const useProjectSettingsEvents = (
  identifier: string,
  isRepo: boolean,
  limit: number = EVENT_LIMIT,
) => {
  const dispatchToast = useToastContext();

  const { allEventsFetched, onCompleted, setPrevCount } = useEvents(limit);

  const {
    data: projectEventData,
    fetchMore: projectFetchMore,
    previousData: projectPreviousData,
  } = useQuery<ProjectEventLogsQuery, ProjectEventLogsQueryVariables>(
    PROJECT_EVENT_LOGS,
    {
      variables: { identifier, limit },
      errorPolicy: "all",
      skip: isRepo,
      notifyOnNetworkStatusChange: true,
      onCompleted: ({ projectEvents: { count } }) => onCompleted(count),
      onError: (e) => {
        dispatchToast.error(`Unable to fetch events for ${identifier}: ${e}`);
      },
    },
  );

  const {
    data: repoEventData,
    fetchMore: repoFetchMore,
    previousData: repoPreviousData,
  } = useQuery<RepoEventLogsQuery, RepoEventLogsQueryVariables>(
    REPO_EVENT_LOGS,
    {
      variables: { id: identifier, limit },
      errorPolicy: "all",
      skip: !isRepo,
      notifyOnNetworkStatusChange: true,
      onCompleted: ({ repoEvents: { count } }) => onCompleted(count),
      onError: (e) => {
        dispatchToast.error(`Unable to fetch events for ${identifier}: ${e}`);
      },
    },
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
  }, [previousData, setPrevCount]);

  return { allEventsFetched, events, fetchMore };
};
