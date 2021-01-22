import React from "react";
import { ApolloError } from "@apollo/client";
import styled from "@emotion/styled";
import { uiColors } from "@leafygreen-ui/palette";
import { useTaskAnalytics } from "analytics";
import { MetadataCard } from "components/MetadataCard";
import { StyledLink, Divider, StyledRouterLink } from "components/styles";
import { H3, P2 } from "components/Typography";
import {
  getTaskQueueRoute,
  getTaskRoute,
  paths,
  getSpawnHostRoute,
  getVersionRoute,
} from "constants/routes";
import { GetTaskQuery } from "gql/generated/types";
import { DependsOn } from "pages/task/metadata/DependsOn";
import { TaskStatus } from "types/task";
import { getUiUrl } from "utils/getEnvironmentVariables";
import { msToDuration, getDateCopy } from "utils/string";
import { ETATimer } from "./metadata/ETATimer";

const { red } = uiColors;

interface Props {
  taskId: string;
  loading: boolean;
  task: GetTaskQuery["task"];
  error: ApolloError;
}

export const Metadata: React.FC<Props> = ({
  loading,
  task = {},
  error,
  taskId,
}) => {
  const taskAnalytics = useTaskAnalytics();

  const {
    status,
    spawnHostLink,
    ingestTime,
    finishTime,
    hostId,
    startTime,
    estimatedStart,
    timeTaken,
    revision,
    reliesOn,
    baseTaskMetadata,
    ami,
    distroId,
    priority,
    patchMetadata,
    buildVariant,
    details,
    generatedBy,
    generatedByName,
    minQueuePosition: taskQueuePosition,
  } = task;

  const baseCommit = revision?.slice(0, 10);

  const { baseTaskDuration, baseTaskLink } = baseTaskMetadata ?? {};

  const { author, patchID } = patchMetadata ?? {};
  const oomTracker = details?.oomTracker;

  const hostLink = `${paths.host}/${hostId}`;
  const distroLink = `${getUiUrl()}/distros##${distroId}`;

  return (
    <>
      <MetadataCard error={error} loading={loading} title="Task Metadata">
        <P2 data-cy="task-metadata-build-variant">
          Build Variant Name:{" "}
          <StyledRouterLink
            data-cy="build-variant-link"
            to={`${getVersionRoute(patchID, {
              page: 0,
              variant: buildVariant,
            })}?`}
            onClick={() =>
              taskAnalytics.sendEvent({ name: "Click Build Variant Link" })
            }
          >
            {buildVariant}
          </StyledRouterLink>
        </P2>
        <P2>Submitted by: {author}</P2>

        {ingestTime && (
          <P2 data-cy="task-metadata-submitted-at">
            Submitted at: {getDateCopy(ingestTime)}
          </P2>
        )}
        {generatedBy && (
          <P2>
            <span>Generated by: </span>
            <StyledRouterLink to={getTaskRoute(generatedBy)}>
              {generatedByName}
            </StyledRouterLink>
          </P2>
        )}
        {estimatedStart > 0 && (
          <P2>
            Estimated time to start:{" "}
            <span data-cy="task-metadata-estimated_start">
              {msToDuration(estimatedStart)}
            </span>
          </P2>
        )}
        {/* Can only show the time running and eta if the task is running and 
      it has a baseTaskDuration to calculate the eta with */}
        {status === TaskStatus.Started && baseTaskDuration && (
          <ETATimer startTime={startTime} baseTaskDuration={baseTaskDuration} />
        )}
        {startTime && (
          <P2>
            Started:{" "}
            <span data-cy="task-metadata-started">
              {getDateCopy(startTime)}
            </span>
          </P2>
        )}
        {finishTime && (
          <P2>
            Finished:{" "}
            <span data-cy="task-metadata-finished">
              {getDateCopy(finishTime)}
            </span>
          </P2>
        )}
        {timeTaken > 0 && (
          <P2 data-cy="task-metadata-duration">
            Duration: {msToDuration(timeTaken)}{" "}
          </P2>
        )}
        {baseTaskDuration !== undefined && (
          <P2 data-cy="task-metadata-base-commit-duration">
            Base commit duration: {msToDuration(baseTaskDuration)}
          </P2>
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
          Distro:{" "}
          <StyledLink
            data-cy="task-distro-link"
            href={distroLink}
            onClick={() =>
              taskAnalytics.sendEvent({ name: "Click Distro Link" })
            }
          >
            {distroId}
          </StyledLink>
        </P2>
        {ami && <P2 data-cy="task-metadata-ami">AMI: {ami}</P2>}
        {hostId && (
          <P2>
            Host:{" "}
            <StyledLink
              data-cy="task-host-link"
              href={hostLink}
              onClick={() =>
                taskAnalytics.sendEvent({ name: "Click Host Link" })
              }
            >
              {hostId}
            </StyledLink>
          </P2>
        )}
        {priority !== 0 && (
          <P2 data-cy="task-metadata-priority">
            Priority: {priority} {priority < 0 && `(Disabled)`}
          </P2>
        )}
        {spawnHostLink && (
          <P2>
            <StyledRouterLink
              data-cy="task-spawn-host-link"
              to={getSpawnHostRoute({
                distroId,
                spawnHost: true,
                taskId,
              })}
              onClick={() =>
                taskAnalytics.sendEvent({ name: "Click Spawn Host" })
              }
            >
              Spawn host
            </StyledRouterLink>
          </P2>
        )}
        {taskQueuePosition > 0 && (
          <P2>
            Position in queue:{" "}
            <StyledRouterLink
              data-cy="task-queue-position"
              to={getTaskQueueRoute(distroId, taskId)}
            >
              {taskQueuePosition}
            </StyledRouterLink>
          </P2>
        )}
        {oomTracker && oomTracker.detected && (
          <RedP2>
            Out of Memory Kill detected
            {oomTracker.pids ? `(PIDs: ${oomTracker.pids.join(", ")}` : ""} )
          </RedP2>
        )}
        {reliesOn && reliesOn.length ? (
          <span data-cy="depends-on-container">
            <H3>Depends On</H3>
            <Divider />
            {reliesOn.map((props) => (
              <DependsOn key={`dependOnPill_${props.uiLink}`} {...props} />
            ))}
          </span>
        ) : null}
      </MetadataCard>
    </>
  );
};

const RedP2 = styled(P2)`
  color: ${red.dark2};
  font-weight: 500;
`;
