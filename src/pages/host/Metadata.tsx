import React from "react";
import { ApolloError } from "apollo-client";
import { StyledLink } from "components/styles";
import { HostQuery } from "gql/generated/types";
import { getUiUrl } from "utils/getEnvironmentVariables";
import { getDateCopy } from "utils/string";
import { P2 } from "components/Typography";
import { HostCard } from "pages/host/HostCard";
import styled from "@emotion/styled";

export const Metadata: React.FC<{
  loading: boolean;
  data: HostQuery;
  error: ApolloError;
  timeZone: string;
}> = ({ loading, data, error, timeZone }) => {
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

  const taskLink = `${getUiUrl()}/task/${runningTaskId}`;
  const distroLink = `${getUiUrl()}/distros##${distroId}`;

  return (
    <HostCard error={error} loading={loading} metaData>
      <P2>User: {user}</P2>
      <P2>Host Name: {hostUrl}</P2>
      <P2 data-cy="host-last-communication">
        Last Communication: {getDateCopy(lastCommunicationTime, timeZone)}
      </P2>
      <P2>Started By: {startedBy}</P2>
      <P2>Cloud Provider: {provider}</P2>
      <P2>
        Distro:{" "}
        <StyledLink data-cy="distro-link" href={distroLink}>
          {distroId}
        </StyledLink>
      </P2>
      <P2 data-cy="current-running-task">
        Current Task:{" "}
        {runningTaskName ? (
          <StyledLink data-cy="running-task-link" href={taskLink}>
            {runningTaskName}
          </StyledLink>
        ) : (
          <Italic>none</Italic>
        )}
      </P2>
    </HostCard>
  );
};

const Italic = styled.i`
  color: silver;
`;
