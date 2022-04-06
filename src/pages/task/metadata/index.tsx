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
  getHostRoute,
  getSpawnHostRoute,
  getVersionRoute,
  getProjectPatchesRoute,
} from "constants/routes";
import { GetTaskQuery } from "gql/generated/types";
import { useUserTimeZone } from "hooks/useUserTimeZone";
import { TaskStatus } from "types/task";
import { environmentalVariables, string } from "utils";
import { AbortMessage } from "./AbortMessage";
import { DependsOn } from "./DependsOn";
import { ETATimer } from "./ETATimer";

const { msToDuration, getDateCopy } = string;
const { getUiUrl } = environmentalVariables;
const { red } = uiColors;

interface Props {
  taskId: string;
  loading: boolean;
  task: GetTaskQuery["task"];
  error: ApolloError;
}

export const Metadata: React.VFC<Props> = ({
  loading,
  task,
  error,
  taskId,
}) => {
  const taskAnalytics = useTaskAnalytics();
  const tz = useUserTimeZone();
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
    dependsOn,
    ami,
    distroId,
    priority,
    versionMetadata,
    buildVariant,
    details,
    generatedBy,
    generatedByName,
    minQueuePosition: taskQueuePosition,
    projectId,
    abortInfo,
    displayTask,
    project,
    expectedDuration,
    baseTask,
  } = task || {};

  const baseCommit = revision?.slice(0, 10);
  const { id: baseTaskId, timeTaken: baseTaskDuration } = baseTask ?? {};
  const projectIdentifier = project?.identifier;
  const { author, id: versionID } = versionMetadata ?? {};
  const oomTracker = details?.oomTracker;

  const hostLink = getHostRoute(hostId);
  const distroLink = `${getUiUrl()}/distros##${distroId}`;
  return (
    <>
      <MetadataCard error={error} loading={loading} title="Task Metadata">
        <P2 data-cy="task-metadata-build-variant">
          Build Variant Name:{" "}
          <StyledRouterLink
            data-cy="build-variant-link"
            to={getVersionRoute(versionID, {
              page: 0,
              variant: buildVariant,
            })}
            onClick={() =>
              taskAnalytics.sendEvent({ name: "Click Build Variant Link" })
            }
          >
            {buildVariant}
          </StyledRouterLink>
        </P2>
        <P2 data-cy="task-metadata-project">
          Project:{" "}
          <StyledRouterLink
            data-cy="project-link"
            to={getProjectPatchesRoute(projectId)}
            onClick={() =>
              taskAnalytics.sendEvent({ name: "Click Project Link" })
            }
          >
            {projectIdentifier}
          </StyledRouterLink>
        </P2>
        <P2>Submitted by: {author}</P2>

        {ingestTime && (
          <P2 data-cy="task-metadata-submitted-at">
            Submitted at: {getDateCopy(ingestTime, { tz })}
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
        {status === TaskStatus.Started && expectedDuration > 0 && (
          <ETATimer startTime={startTime} expectedDuration={expectedDuration} />
        )}
        {startTime && (
          <P2>
            Started:{" "}
            <span data-cy="task-metadata-started">
              {getDateCopy(startTime, { tz })}
            </span>
          </P2>
        )}
        {finishTime && (
          <P2>
            Finished:{" "}
            <span data-cy="task-metadata-finished">
              {getDateCopy(finishTime, { tz })}
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
        {baseTaskId && (
          <P2>
            Base commit:{" "}
            <StyledRouterLink
              data-cy="base-task-link"
              to={getTaskRoute(baseTaskId)}
              onClick={() =>
                taskAnalytics.sendEvent({ name: "Click Base Commit" })
              }
            >
              {baseCommit}
            </StyledRouterLink>
          </P2>
        )}
        {details?.status === TaskStatus.Failed && (
          <P2>Failing command: {details?.description}</P2>
        )}
        {details?.timeoutType && details?.timeoutType !== "" && (
          <P2>Timeout type: {details?.timeoutType}</P2>
        )}
        {displayTask && (
          <P2>
            Display Task:{" "}
            <StyledRouterLink
              to={getTaskRoute(displayTask.id, {
                execution: displayTask.execution,
              })}
              onClick={() =>
                taskAnalytics.sendEvent({ name: "Click Display Task Link" })
              }
            >
              {displayTask.displayName}
            </StyledRouterLink>
          </P2>
        )}
        {distroId && (
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
        )}
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
        {abortInfo && <AbortMessage {...abortInfo} />}
        {oomTracker && oomTracker.detected && (
          <OOMTrackerMessage>
            Out of Memory Kill detected
            {oomTracker.pids ? `(PIDs: ${oomTracker.pids.join(", ")}` : ""} )
          </OOMTrackerMessage>
        )}
        {dependsOn && dependsOn.length ? (
          <span data-cy="depends-on-container">
            <H3>Depends On</H3>
            <Divider />
            {dependsOn.map((dep) => (
              <DependsOn
                key={`dependOnPill_${dep.taskId}`}
                name={dep.name}
                buildVariant={dep.buildVariant}
                metStatus={dep.metStatus}
                requiredStatus={dep.requiredStatus}
                taskId={dep.taskId}
              />
            ))}
          </span>
        ) : null}
      </MetadataCard>
    </>
  );
};

const OOMTrackerMessage = styled(P2)`
  color: ${red.dark2};
  font-weight: 500;
`;
