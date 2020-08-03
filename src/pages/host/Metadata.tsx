import React from "react";
import { ApolloError } from "apollo-client";
import { StyledLink } from "components/styles";
import { format } from "date-fns";
import { P2 } from "components/Typography";
import { MetadataCard } from "components/MetadataCard";
import { HostQuery } from "gql/generated/types";
import { getUiUrl } from "utils/getEnvironmentVariables";

export const Metadata: React.FC<{
  loading: boolean;
  data: HostQuery;
  error: ApolloError;
}> = ({ loading, data, error }) => {
  const host = data ? data.host : null;

  const hostUrl = host?.hostUrl;
  const distroId = host?.distroId;
  const startedBy = host?.startedBy;
  const provider = host?.provider;
  const user = host?.user;
  const lastCommunicationTime = host?.lastCommunicationTime;

  const runningTask = host?.runningTask;
  const runningTaskId = runningTask?.id;
  const runningTaskName = runningTask?.name;
  const sshCommand = `ssh${user}@${hostUrl}`;

  const taskLink = `${getUiUrl()}/task/${runningTaskId}`;
  const distroLink = `${getUiUrl()}/distros##${distroId}`;
  return (
    <MetadataCard error={error} loading={loading} title="Task Metadata">
      <P2>User: {user}</P2>
      <P2>Host Name: {hostUrl}</P2>
      <P2>SSH Command: {sshCommand}</P2>
      <P2>Last Communication: {getDateCopy(lastCommunicationTime)}</P2>
      <P2>Started By: {startedBy}</P2>
      <P2>Cloud Provider: {provider}</P2>
      <P2>
        Distro:{" "}
        <StyledLink data-cy="task-distro-link" href={distroLink}>
          {distroId}
        </StyledLink>
      </P2>
      <P2>
        Current Task:{" "}
        <StyledLink data-cy="task-distro-link" href={taskLink}>
          {runningTaskName}
        </StyledLink>
      </P2>
    </MetadataCard>
  );
};

const DATE_FORMAT = "MMM d, yyyy, h:mm:ss aaaa";
const getDateCopy = (d: Date): string =>
  d ? format(new Date(d), DATE_FORMAT) : "";
