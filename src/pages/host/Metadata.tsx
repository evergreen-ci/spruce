import React from "react";
import { ApolloError } from "apollo-client";
import { StyledLink } from "components/styles";
import { HostMetaDataCard, Row } from "pages/host/HostMetaDataCard";
import { HostQuery } from "gql/generated/types";
import { getUiUrl } from "utils/getEnvironmentVariables";
import { getDateCopy } from "utils/string";

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
  const sshCommand = `ssh ${user}@${hostUrl}`;

  const taskLink = `${getUiUrl()}/task/${runningTaskId}`;
  const distroLink = `${getUiUrl()}/distros##${distroId}`;
  return (
    <HostMetaDataCard error={error} loading={loading}>
      <Row>User: {user}</Row>
      <Row>Host Name: {hostUrl}</Row>
      <Row>SSH Command: {sshCommand}</Row>
      <Row>Last Communication: {getDateCopy(lastCommunicationTime)}</Row>
      <Row>Started By: {startedBy}</Row>
      <Row>Cloud Provider: {provider}</Row>
      <Row>
        Distro:{" "}
        <StyledLink data-cy="task-distro-link" href={distroLink}>
          {distroId}
        </StyledLink>
      </Row>
      <Row>
        Current Task:{" "}
        <StyledLink data-cy="task-distro-link" href={taskLink}>
          {runningTaskName}
        </StyledLink>
      </Row>
    </HostMetaDataCard>
  );
};
