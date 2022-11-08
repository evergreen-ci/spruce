import { InlineCode } from "@leafygreen-ui/typography";
import { useVersionAnalytics } from "analytics";
import { MetadataCard } from "components/MetadataCard";
import { StyledLink, StyledRouterLink } from "components/styles";
import { P2 } from "components/Typography";
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
    <MetadataCard
      loading={loading}
      error={null}
      title={isPatch ? "Patch Metadata" : "Version Metadata"}
    >
      <P2>
        Project:{" "}
        {projectIdentifier ? (
          <StyledRouterLink to={getProjectPatchesRoute(projectIdentifier)}>
            {projectIdentifier}
          </StyledRouterLink>
        ) : (
          `${owner}/${repo}`
        )}
      </P2>
      <P2>Makespan: {makespan && msToDuration(makespan)}</P2>
      <P2>Time taken: {timeTaken && msToDuration(timeTaken)}</P2>
      <P2>Submitted at: {createTime && getDateCopy(createTime)}</P2>
      <P2>Started: {startTime && getDateCopy(startTime)}</P2>
      <P2>Finished: {finishTime && getDateCopy(finishTime)}</P2>
      <P2>{`Submitted by: ${author}`}</P2>
      {isPatch ? (
        <P2>
          Base commit:{" "}
          <InlineCode>
            <StyledRouterLink
              data-cy="patch-base-commit"
              to={getVersionRoute(baseVersion?.id)}
              onClick={() => sendEvent({ name: "Click Base Commit Link" })}
            >
              {shortenGithash(revision)}
            </StyledRouterLink>
          </InlineCode>
        </P2>
      ) : (
        <P2>
          Previous commit:{" "}
          <InlineCode>
            <StyledRouterLink
              data-cy="version-previous-commit"
              to={getVersionRoute(previousVersion?.id)}
              onClick={() => sendEvent({ name: "Click Previous Version Link" })}
            >
              {shortenGithash(previousVersion?.revision)}
            </StyledRouterLink>
          </InlineCode>
        </P2>
      )}
      {!isPatch && (
        <P2>
          Github Commit:{" "}
          <InlineCode>
            <StyledLink
              data-cy="version-github-commit"
              href={getGithubCommitUrl(owner, repo, revision)}
              onClick={() => sendEvent({ name: "Click Github Commit Link" })}
            >
              {shortenGithash(revision)}
            </StyledLink>
          </InlineCode>
        </P2>
      )}
      {isPatch && commitQueuePosition !== null && (
        <P2>
          <StyledRouterLink
            data-cy="commit-queue-position"
            to={getCommitQueueRoute(project)}
          >
            Commit Queue Position: {commitQueuePosition}
          </StyledRouterLink>
        </P2>
      )}
      {manifest && <ManifestBlob manifest={manifest} />}
      {upstreamProject && (
        <P2>
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
        </P2>
      )}
      <ParametersModal parameters={parameters} />
    </MetadataCard>
  );
};
