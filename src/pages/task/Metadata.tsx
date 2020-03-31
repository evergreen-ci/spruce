import React from "react";
import { Divider } from "components/styles";
import { H3, P2 } from "components/Typography";
import { Skeleton } from "antd";
import { format } from "date-fns";
import { TaskQuery } from "gql/queries/get-task";
import get from "lodash/get";
import { msToDuration } from "utils/string";
import { MetadataCard } from "components/MetadataCard";
import { ApolloError } from "apollo-client";
import { StyledLink } from "components/styles";
import { DependsOn } from "./metadata/DependsOn";

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

  if (loading) {
    return (
      <MetadataCard title={CARD_TITLE}>
        <Skeleton active={true} title={false} paragraph={{ rows: 4 }} />
      </MetadataCard>
    );
  }

  if (error) {
    return (
      <MetadataCard title={CARD_TITLE}>
        <div data-cy="task-metadata-error">{error.message}</div>
      </MetadataCard>
    );
  }

  return (
    <MetadataCard title={CARD_TITLE}>
      <P2>Submitted by: {author}</P2>
      <P2>Submitted at: {getDateCopy(createTime)}</P2>
      <P2>Started: {getDateCopy(startTime)}</P2>
      <P2>Finished: {getDateCopy(finishTime)}</P2>
      <P2>Duration: {secToDuration(timeTaken)} </P2>
      <P2>Base commit duration: {secToDuration(baseTaskDuration)}</P2>
      <P2>
        Base commit: <StyledLink href={baseTaskLink}>{baseCommit}</StyledLink>
      </P2>
      <P2>
        Host: <StyledLink href={hostLink}>{hostId}</StyledLink>
      </P2>
      {reliesOn && reliesOn.length ? (
        <>
          <H3>Depends On</H3>
          <Divider />
          {reliesOn.map(props => (
            <DependsOn {...props} />
          ))}
        </>
      ) : null}
    </MetadataCard>
  );
};

const CARD_TITLE = "Task Metadata";

const secToDuration = (seconds: number) => {
  const ms = seconds * 1000;
  return msToDuration(Math.trunc(ms));
};

const DATE_FORMAT = "MMM d, yyyy, h:mm:ss aaaa";
const getDateCopy = (d: string): string =>
  d ? format(new Date(d), DATE_FORMAT) : "";
