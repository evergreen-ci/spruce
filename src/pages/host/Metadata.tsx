import { ApolloError } from "@apollo/client";
import styled from "@emotion/styled";
import { formatDistanceToNow } from "date-fns";
import {
  MetadataCard,
  MetadataItem,
  MetadataTitle,
} from "components/MetadataCard";
import { StyledLink } from "components/styles";
import { getTaskRoute } from "constants/routes";
import { HostQuery } from "gql/generated/types";
import { environmentalVariables } from "utils";

const { getUiUrl } = environmentalVariables;

export const Metadata: React.VFC<{
  loading: boolean;
  data: HostQuery;
  error: ApolloError;
}> = ({ loading, data, error }) => {
  const host = data?.host ?? null;

  const hostUrl = host?.hostUrl;
  const distroId = host?.distroId;
  const startedBy = host?.startedBy;
  const provider = host?.provider;
  const user = host?.user;
  const lastCommunicationTime = host?.lastCommunicationTime;

  const runningTask = host?.runningTask;
  const runningTaskId = runningTask?.id;
  const runningTaskName = runningTask?.name;

  const taskLink = getTaskRoute(runningTaskId);
  const distroLink = `${getUiUrl()}/distros##${distroId}`;

  return (
    <MetadataCard error={error} loading={loading}>
      <MetadataTitle>Host Details</MetadataTitle>
      <MetadataItem>User: {user}</MetadataItem>
      {hostUrl && <MetadataItem>Host Name: {hostUrl}</MetadataItem>}
      {lastCommunicationTime && (
        <MetadataItem data-cy="host-last-communication">
          Last Communication:{" "}
          {formatDistanceToNow(new Date(lastCommunicationTime))} ago
        </MetadataItem>
      )}
      <MetadataItem>Started By: {startedBy}</MetadataItem>
      <MetadataItem>Cloud Provider: {provider}</MetadataItem>
      <MetadataItem>
        Distro:{" "}
        <StyledLink data-cy="distro-link" href={distroLink}>
          {distroId}
        </StyledLink>
      </MetadataItem>
      <MetadataItem data-cy="current-running-task">
        Current Task:{" "}
        {runningTaskName ? (
          <StyledLink data-cy="running-task-link" href={taskLink}>
            {runningTaskName}
          </StyledLink>
        ) : (
          <Italic>none</Italic>
        )}
      </MetadataItem>
    </MetadataCard>
  );
};

const Italic = styled.i`
  color: silver;
`;
