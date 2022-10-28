import { ApolloError } from "@apollo/client";
import styled from "@emotion/styled";
import { palette } from "@leafygreen-ui/palette";
import { InlineCode } from "@leafygreen-ui/typography";
import { useTaskAnalytics } from "analytics";
import {
  MetadataCard,
  MetadataItem,
  MetadataTitle,
} from "components/MetadataCard";
import { StyledLink, StyledRouterLink } from "components/styles";
import {
  getTaskQueueRoute,
  getTaskRoute,
  getHostRoute,
  getSpawnHostRoute,
  getVersionRoute,
  getProjectPatchesRoute,
} from "constants/routes";
import { GetTaskQuery } from "gql/generated/types";
import { useDateFormat } from "hooks";
import { TaskStatus } from "types/task";
import { environmentalVariables, string } from "utils";
import { AbortMessage } from "./AbortMessage";
import { DependsOn } from "./DependsOn";
import { ETATimer } from "./ETATimer";

const { msToDuration, shortenGithash } = string;
const { getUiUrl } = environmentalVariables;
const { red } = palette;

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
  const getDateCopy = useDateFormat();
  const {
    status,
    spawnHostLink,
    ingestTime,
    activatedTime,
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
    abortInfo,
    displayTask,
    project,
    expectedDuration,
    baseTask,
  } = task || {};

  const baseCommit = shortenGithash(revision);
  const submittedTime = activatedTime ?? ingestTime;
  const { id: baseTaskId, timeTaken: baseTaskDuration } = baseTask ?? {};
  const projectIdentifier = project?.identifier;
  const { author, id: versionID } = versionMetadata ?? {};
  const oomTracker = details?.oomTracker;

  const hostLink = getHostRoute(hostId);
  const distroLink = `${getUiUrl()}/distros##${distroId}`;
  return (
    <MetadataCard error={error} loading={loading}>
      <MetadataTitle>Task Metadata</MetadataTitle>
      <MetadataItem data-cy="task-metadata-build-variant">
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
      </MetadataItem>
      <MetadataItem data-cy="task-metadata-project">
        Project:{" "}
        <StyledRouterLink
          data-cy="project-link"
          to={getProjectPatchesRoute(projectIdentifier)}
          onClick={() =>
            taskAnalytics.sendEvent({ name: "Click Project Link" })
          }
        >
          {projectIdentifier}
        </StyledRouterLink>
      </MetadataItem>
      <MetadataItem>Submitted by: {author}</MetadataItem>

      {submittedTime && (
        <MetadataItem data-cy="task-metadata-submitted-at">
          Submitted at: {getDateCopy(submittedTime)}
        </MetadataItem>
      )}
      {generatedBy && (
        <MetadataItem>
          <span>Generated by: </span>
          <StyledRouterLink to={getTaskRoute(generatedBy)}>
            {generatedByName}
          </StyledRouterLink>
        </MetadataItem>
      )}
      {estimatedStart > 0 && (
        <MetadataItem>
          Estimated time to start:{" "}
          <span data-cy="task-metadata-estimated_start">
            {msToDuration(estimatedStart)}
          </span>
        </MetadataItem>
      )}
      {status === TaskStatus.Started && expectedDuration > 0 && (
        <ETATimer startTime={startTime} expectedDuration={expectedDuration} />
      )}
      {startTime && (
        <MetadataItem>
          Started:{" "}
          <span data-cy="task-metadata-started">{getDateCopy(startTime)}</span>
        </MetadataItem>
      )}
      {finishTime && (
        <MetadataItem>
          Finished:{" "}
          <span data-cy="task-metadata-finished">
            {getDateCopy(finishTime)}
          </span>
        </MetadataItem>
      )}
      {timeTaken > 0 && (
        <MetadataItem data-cy="task-metadata-duration">
          Duration: {msToDuration(timeTaken)}{" "}
        </MetadataItem>
      )}
      {baseTaskDuration !== undefined && (
        <MetadataItem data-cy="task-metadata-base-commit-duration">
          Base commit duration: {msToDuration(baseTaskDuration)}
        </MetadataItem>
      )}
      {baseTaskId && (
        <MetadataItem>
          Base commit:{" "}
          <InlineCode>
            <StyledRouterLink
              data-cy="base-task-link"
              to={getTaskRoute(baseTaskId)}
              onClick={() =>
                taskAnalytics.sendEvent({ name: "Click Base Commit" })
              }
            >
              {baseCommit}
            </StyledRouterLink>
          </InlineCode>
        </MetadataItem>
      )}
      {details?.status === TaskStatus.Failed && (
        <MetadataItem>
          Failing command: {processFailingCommand(details?.description)}
        </MetadataItem>
      )}
      {details?.timeoutType && details?.timeoutType !== "" && (
        <MetadataItem>Timeout type: {details?.timeoutType}</MetadataItem>
      )}
      {displayTask && (
        <MetadataItem>
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
        </MetadataItem>
      )}
      {distroId && (
        <MetadataItem>
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
        </MetadataItem>
      )}
      {ami && (
        <MetadataItem data-cy="task-metadata-ami">AMI: {ami}</MetadataItem>
      )}
      {hostId && (
        <MetadataItem>
          Host:{" "}
          <StyledLink
            data-cy="task-host-link"
            href={hostLink}
            onClick={() => taskAnalytics.sendEvent({ name: "Click Host Link" })}
          >
            {hostId}
          </StyledLink>
        </MetadataItem>
      )}
      {priority !== 0 && (
        <MetadataItem data-cy="task-metadata-priority">
          Priority: {priority} {priority < 0 && `(Disabled)`}
        </MetadataItem>
      )}
      {spawnHostLink && (
        <MetadataItem>
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
        </MetadataItem>
      )}
      {taskQueuePosition > 0 && (
        <MetadataItem>
          Position in queue:{" "}
          <StyledRouterLink
            data-cy="task-queue-position"
            to={getTaskQueueRoute(distroId, taskId)}
          >
            {taskQueuePosition}
          </StyledRouterLink>
        </MetadataItem>
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
          <MetadataTitle>Depends On</MetadataTitle>
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
  );
};

const processFailingCommand = (description: string): string => {
  if (description === "stranded") {
    return "Task failed because spot host was unexpectedly terminated by AWS.";
  }
  return description;
};

const OOMTrackerMessage = styled(MetadataItem)`
  color: ${red.dark2};
  font-weight: 500;
`;
