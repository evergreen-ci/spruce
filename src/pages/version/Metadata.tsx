import { InlineCode } from "@leafygreen-ui/typography";
import { useVersionAnalytics } from "analytics";
import {
  MetadataCard,
  MetadataItem,
  MetadataTitle,
} from "components/MetadataCard";
import { StyledRouterLink } from "components/styles";
import { getGithubCommitUrl } from "constants/externalResources";
import {
  getCommitQueueRoute,
  getProjectPatchesRoute,
  getTaskRoute,
  getVersionRoute,
} from "constants/routes";
import { VersionQuery } from "gql/generated/types";
import { useDateFormat } from "hooks";
import { ProjectTriggerLevel } from "types/triggers";
import { string } from "utils";
import ManifestBlob from "./ManifestBlob";
import { ParametersModal } from "./ParametersModal";

const { msToDuration, shortenGithash } = string;

interface Props {
  loading: boolean;
  version: VersionQuery["version"];
}

export const Metadata: React.VFC<Props> = ({ loading, version }) => {
  const getDateCopy = useDateFormat();
  const {
    author,
    revision,
    project,
    versionTiming,
    createTime,
    startTime,
    finishTime,
    patch,
    projectIdentifier,
    baseVersion,
    isPatch,
    parameters,
    manifest,
    id,
    previousVersion,
    upstreamProject,
    projectMetadata,
  } = version || {};
  const { sendEvent } = useVersionAnalytics(id);
  const { commitQueuePosition } = patch || {};
  const { makespan, timeTaken } = versionTiming || {};
  const {
    project: upstreamProjectIdentifier,
    triggerType,
    task: upstreamTask,
    version: upstreamVersion,
  } = upstreamProject || {};

  const { repo, owner } = projectMetadata || {};
  return (
    <MetadataCard loading={loading} error={null}>
      <MetadataTitle>
        {isPatch ? "Patch Metadata" : "Version Metadata"}
      </MetadataTitle>

      <MetadataItem>
        Project:{" "}
        {projectIdentifier ? (
          <StyledRouterLink
            to={getProjectPatchesRoute(projectIdentifier)}
            onClick={() =>
              sendEvent({ name: "Click Project Patches Metadata Link" })
            }
          >
            {projectIdentifier}
          </StyledRouterLink>
        ) : (
          `${owner}/${repo}`
        )}
      </MetadataItem>
      <MetadataItem>
        Makespan: {makespan && msToDuration(makespan)}
      </MetadataItem>
      <MetadataItem>
        Time taken: {timeTaken && msToDuration(timeTaken)}
      </MetadataItem>
      <MetadataItem>
        Submitted at: {createTime && getDateCopy(createTime)}
      </MetadataItem>
      <MetadataItem>
        Started: {startTime && getDateCopy(startTime)}
      </MetadataItem>
      <MetadataItem>
        Finished: {finishTime && getDateCopy(finishTime)}
      </MetadataItem>
      <MetadataItem>{`Submitted by: ${author}`}</MetadataItem>
      {isPatch ? (
        <MetadataItem>
          Base commit:{" "}
          <InlineCode
            data-cy="patch-base-commit"
            href={getVersionRoute(baseVersion?.id)}
            onClick={() => sendEvent({ name: "Click Base Commit Link" })}
          >
            {shortenGithash(revision)}
          </InlineCode>
        </MetadataItem>
      ) : (
        <MetadataItem>
          Previous commit:{" "}
          <InlineCode
            data-cy="version-previous-commit"
            href={getVersionRoute(previousVersion?.id)}
            onClick={() => sendEvent({ name: "Click Previous Version Link" })}
          >
            {shortenGithash(previousVersion?.revision)}
          </InlineCode>
        </MetadataItem>
      )}
      {!isPatch && (
        <MetadataItem>
          Github Commit:{" "}
          <InlineCode
            data-cy="version-github-commit"
            href={getGithubCommitUrl(owner, repo, revision)}
            onClick={() => sendEvent({ name: "Click Github Commit Link" })}
          >
            {shortenGithash(revision)}
          </InlineCode>
        </MetadataItem>
      )}
      {isPatch && commitQueuePosition !== null && (
        <MetadataItem>
          <StyledRouterLink
            data-cy="commit-queue-position"
            to={getCommitQueueRoute(project)}
          >
            Commit Queue Position: {commitQueuePosition}
          </StyledRouterLink>
        </MetadataItem>
      )}
      {manifest && <ManifestBlob manifest={manifest} />}
      {upstreamProject && (
        <MetadataItem>
          Triggered from:{" "}
          <StyledRouterLink
            to={
              triggerType === ProjectTriggerLevel.TASK
                ? getTaskRoute(upstreamTask.id)
                : getVersionRoute(upstreamVersion.id)
            }
          >
            {upstreamProjectIdentifier}
          </StyledRouterLink>
        </MetadataItem>
      )}
      <ParametersModal parameters={parameters} />
    </MetadataCard>
  );
};
