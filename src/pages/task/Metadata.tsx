import React from "react";
import { SiderCard, Divider } from "components/styles";
import { H3, P2 } from "components/Typography";
import { Skeleton } from "antd";
import { format } from "date-fns";
import { TaskQuery } from "gql/queries/get-task";
import get from "lodash/get";
import { msToDuration } from "utils/string";
import { MetadataCard } from "components/MetadataCard";
import { ApolloError } from "apollo-client";

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
      <H3>Task Metadata</H3>
      <Divider />
      <P2>Submitted by: {author}</P2>
      <P2>Submitted at: {getDateCopy(createTime)}</P2>
      <P2>Started: {getDateCopy(startTime)}</P2>
      <P2>Finished: {getDateCopy(finishTime)}</P2>
      <P2>Duration: {secToDuration(timeTaken)} </P2>
      <P2>Base commit duration: {secToDuration(baseTaskDuration)}</P2>
      <P2>
        Base commit: <a href={baseTaskLink}>{baseCommit}</a>
      </P2>
      <P2>
        Host: <a href={hostLink}>{hostId}</a>
      </P2>
      <div />
      <H3>Depends On</H3>
      <Divider />
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
