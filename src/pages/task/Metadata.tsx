import React from "react";
import { ApolloError } from "apollo-client";
import { Divider, StyledLink } from "components/styles";
import { format } from "date-fns";
import { H3, P2 } from "components/Typography";
import { MetadataCard } from "components/MetadataCard";
import { msToDuration } from "utils/string";
import { v4 as uuid } from "uuid";
import { GetTaskQuery } from "gql/generated/types";
import get from "lodash/get";
import { DependsOn } from "pages/task/metadata/DependsOn";
import { useTaskAnalytics } from "analytics";

export const Metadata: React.FC<{
  loading: boolean;
  data: GetTaskQuery;
  error: ApolloError;
}> = ({ loading, data, error }) => {
  const task = data ? data.task : null;
  const taskAnalytics = useTaskAnalytics();

  const spawnHostLink = get(task, "spawnHostLink");
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
      <P2 data-cy="task-metadata-submitted-at">
        Submitted at: {getDateCopy(createTime)}
      </P2>
      <P2>
        Started:{" "}
        <span data-cy="task-metadata-started">{getDateCopy(startTime)}</span>
      </P2>
      <P2 data-cy="task-metadata-finished">
        Finished:{" "}
        <span data-cy="task-metadata-started">{getDateCopy(finishTime)}</span>
      </P2>
      <P2>Duration: {secToDuration(timeTaken)} </P2>
      {baseTaskDuration !== undefined && (
        <P2>Base commit duration: {secToDuration(baseTaskDuration)}</P2>
      )}
      {baseTaskLink && (
        <P2>
          Base commit:{" "}
          <StyledLink
            data-cy="base-task-link"
            href={baseTaskLink}
            onClick={() =>
              taskAnalytics.sendEvent({ name: "Click Base Commit" })
            }
          >
            {baseCommit}
          </StyledLink>
        </P2>
      )}
      <P2>
        Host:{" "}
        <StyledLink
          data-cy="task-host-link"
          href={hostLink}
          onClick={() => taskAnalytics.sendEvent({ name: "Click Host Link" })}
        >
          {hostId}
        </StyledLink>
      </P2>
      {spawnHostLink && (
        <P2>
          <StyledLink
            data-cy="task-spawn-host-link"
            href={spawnHostLink}
            onClick={() =>
              taskAnalytics.sendEvent({ name: "Click Spawn Host" })
            }
          >
            Spawn host
          </StyledLink>
        </P2>
      )}
      {reliesOn && reliesOn.length ? (
        <span data-cy="depends-on-container">
          <H3>Depends On</H3>
          <Divider />
          {reliesOn.map((props) => (
            <DependsOn key={uuid()} {...props} />
          ))}
        </span>
      ) : null}
    </MetadataCard>
  );
};

const secToDuration = (seconds: number): string => {
  const ms = seconds * 1000;
  return msToDuration(Math.trunc(ms));
};

const DATE_FORMAT = "MMM d, yyyy, h:mm:ss aaaa";
const getDateCopy = (d: Date): string =>
  d ? format(new Date(d), DATE_FORMAT) : "";
