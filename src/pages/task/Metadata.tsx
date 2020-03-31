import React from "react";
import { ApolloError } from "apollo-client";
import { DependsOn } from "./metadata/DependsOn";
import { Divider } from "components/styles";
import { format } from "date-fns";
import { H3, P2 } from "components/Typography";
import { MetadataCard } from "components/MetadataCard";
import { msToDuration } from "utils/string";
import { StyledLink } from "components/styles";
import { TaskQuery } from "gql/queries/get-task";
import get from "lodash/get";

export const Metadata = ({
  loading,
  data,
  error
}: {
  loading: boolean;
  data: TaskQuery;
  error: ApolloError;
}) => {
  const task = data ? data.task : null;

  const createTime = get(task, "createTime");
  const finishTime = get(task, "finishTime");
  const hostId = get(task, "hostId");
  const hostLink = get(task, "hostLink");
  const startTime = get(task, "startTime");
  const timeTaken = get(task, "timeTaken");
  const baseCommit = get(task, "revision", "").slice(0, 10);
  const reliesOn = get(task, "reliesOn");
  const baseTaskMetadata = get(task, "baseTaskMetadata");
  const baseTaskDuration = get(baseTaskMetadata, "baseTaskDuration");
  const baseTaskLink = get(baseTaskMetadata, "baseTaskLink");

  const patchMetadata = get(task, "patchMetadata");
  const author = get(patchMetadata, "author", "");

  return (
    <MetadataCard error={error} loading={loading} title="Task Metadata">
      <P2>Submitted by: {author}</P2>
      <P2>Submitted at: {getDateCopy(createTime)}</P2>
      <P2>Started: {getDateCopy(startTime)}</P2>
      <P2>Finished: {getDateCopy(finishTime)}</P2>
      <P2>Duration: {secToDuration(timeTaken)} </P2>
      <P2>Base commit duration: {secToDuration(baseTaskDuration)}</P2>
      <P2>
        Base commit:{" "}
        <StyledLink data-cy="base-task-link" href={baseTaskLink}>
          {baseCommit}
        </StyledLink>
      </P2>
      <P2>
        Host:{" "}
        <StyledLink data-cy="task-host-link" href={hostLink}>
          {hostId}
        </StyledLink>
      </P2>
      {reliesOn && reliesOn.length ? (
        <span data-cy="depends-on-container">
          <H3>Depends On</H3>
          <Divider />
          {reliesOn.map(props => (
            <DependsOn {...props} />
          ))}
        </span>
      ) : null}
    </MetadataCard>
  );
};

const secToDuration = (seconds: number) => {
  const ms = seconds * 1000;
  return msToDuration(Math.trunc(ms));
};

const DATE_FORMAT = "MMM d, yyyy, h:mm:ss aaaa";
const getDateCopy = (d: string): string =>
  d ? format(new Date(d), DATE_FORMAT) : "";
