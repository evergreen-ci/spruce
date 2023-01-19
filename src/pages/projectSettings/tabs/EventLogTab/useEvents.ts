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

  const [prevCount, setPrevCount] = useState(0);
  const [showLoadButton, setShowLoadButton] = useState(true);

  // Hide Load More button when event count < limit is returned,
  // or when the same event count is returned twice in a row.
  const onCompleted = (eventData) => {
    if (eventData.length === prevCount) {
      setShowLoadButton(false);
    } else if (eventData.length - prevCount < limit) {
      setShowLoadButton(false);
    } else {
      setPrevCount(eventData.length);
    }
  };

  const { data: projectEventData, fetchMore: projectFetchMore } = useQuery<
    ProjectEventLogsQuery,
    ProjectEventLogsQueryVariables
  >(GET_PROJECT_EVENT_LOGS, {
    variables: { identifier, limit },
    errorPolicy: "all",
    skip: isRepo,
    onCompleted: ({ projectEvents: { eventLogEntries } }) =>
      onCompleted(eventLogEntries),
    onError: (e) => {
      dispatchToast.error(`Unable to fetch events for ${identifier}: ${e}`);
    },
  });

  const { data: repoEventData, fetchMore: repoFetchMore } = useQuery<
    RepoEventLogsQuery,
    RepoEventLogsQueryVariables
  >(GET_REPO_EVENT_LOGS, {
    variables: { id: identifier, limit },
    errorPolicy: "all",
    skip: !isRepo,
    onCompleted: ({ repoEvents: { eventLogEntries } }) =>
      onCompleted(eventLogEntries),
    onError: (e) => {
      dispatchToast.error(`Unable to fetch events for ${identifier}: ${e}`);
    },
  });

  const events = isRepo
    ? repoEventData?.repoEvents?.eventLogEntries || []
    : projectEventData?.projectEvents?.eventLogEntries || [];

  const fetchMore = isRepo ? repoFetchMore : projectFetchMore;

  return { events, fetchMore, showLoadButton };
};
