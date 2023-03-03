import { ApolloError } from "@apollo/client";
import styled from "@emotion/styled";
import { palette } from "@leafygreen-ui/palette";
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

const { gray } = palette;
const { getUiUrl } = environmentalVariables;

export const Metadata: React.VFC<{
  loading: boolean;
  host: HostQuery["host"];
  error: ApolloError;
}> = ({ loading, host, error }) => {
  const {
    hostUrl,
    distroId,
    startedBy,
    provider,
    user,
    lastCommunicationTime,
    runningTask,
    uptime,
    ami,
  } = host ?? {};

  const { id: runningTaskId, name: runningTaskName } = runningTask ?? {};

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
      <MetadataItem>
        Uptime: {formatDistanceToNow(new Date(uptime))}
      </MetadataItem>
      <MetadataItem>Started By: {startedBy}</MetadataItem>
      <MetadataItem>Cloud Provider: {provider}</MetadataItem>
      {ami && <MetadataItem>AMI: {ami}</MetadataItem>}
      <MetadataItem>
        Distro:{" "}
        <StyledLink data-cy="distro-link" href={distroLink}>
          {distroId}
        </StyledLink>
      </MetadataItem>
      {startedBy === MCI_USER && (
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
      )}
    </MetadataCard>
  );
};

const Italic = styled.i`
  color: ${gray.light1};
`;

const MCI_USER = "mci";
