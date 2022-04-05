import { useQuery } from "@apollo/client";
import { useParams } from "react-router-dom";
import { useToastContext } from "context/toast";
import {
  ProjectEventLogsQuery,
  ProjectEventLogsQueryVariables,
  RepoEventLogsQuery,
  RepoEventLogsQueryVariables,
} from "gql/generated/types";
import { GET_PROJECT_EVENT_LOGS, GET_REPO_EVENT_LOGS } from "gql/queries";
import { validateObjectId } from "utils/validators";

export const EventLogTab: React.FC = () => {
  const { identifier } = useParams<{ identifier: string }>();
  const isRepo = validateObjectId(identifier);

  const dispatchToast = useToastContext();

  const { data: projectEventData } = useQuery<
    ProjectEventLogsQuery,
    ProjectEventLogsQueryVariables
  >(GET_PROJECT_EVENT_LOGS, {
    variables: { identifier },
    skip: isRepo,
    onError: (e) => {
      dispatchToast.error(`Unable to fetch events for ${identifier}: ${e}`);
    },
  });

  const { data: repoEventData } = useQuery<
    RepoEventLogsQuery,
    RepoEventLogsQueryVariables
  >(GET_REPO_EVENT_LOGS, {
    variables: { identifier },
    skip: !isRepo,
    onError: (e) => {
      dispatchToast.error(`Unable to fetch events for ${identifier}: ${e}`);
    },
  });

  return (
    <>
      <div>This is the event log page for {identifier}</div>
      <div> {JSON.stringify(projectEventData)}</div>
      <div> {JSON.stringify(repoEventData)}</div>
    </>
  );
};
