import { InlineCode, Disclaimer } from "@leafygreen-ui/typography";
import { Link } from "react-router-dom";
import { useVersionAnalytics } from "analytics";
import {
  MetadataCard,
  MetadataItem,
  MetadataTitle,
} from "components/MetadataCard";
import { StyledLink, StyledRouterLink } from "components/styles";
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
import { formatZeroIndexForDisplay } from "utils/numbers";
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
    baseVersion,
    createTime,
    externalLinksForMetadata,
    finishTime,
    gitTags,
    id,
    isPatch,
    manifest,
    parameters,
    patch,
    previousVersion,
    project,
    projectIdentifier,
    projectMetadata,
    revision,
    startTime,
    upstreamProject,
    versionTiming,
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
  const { url, displayName } = externalLinksForMetadata?.[0] || {};
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
        Submitted at:{" "}
        {createTime && (
          <span title={getDateCopy(createTime)}>
            {getDateCopy(createTime, { omitSeconds: true })}
          </span>
        )}
      </MetadataItem>
      <MetadataItem>
        Started:{" "}
        {startTime && (
          <span title={getDateCopy(startTime)}>
            {getDateCopy(startTime, { omitSeconds: true })}
          </span>
        )}
      </MetadataItem>
      {finishTime && (
        <MetadataItem>
          Finished:{" "}
          <span title={getDateCopy(finishTime)}>
            {getDateCopy(finishTime, { omitSeconds: true })}
          </span>
        </MetadataItem>
      )}
      <MetadataItem>{`Submitted by: ${author}`}</MetadataItem>
      {isPatch ? (
        <MetadataItem>
          Base commit:{" "}
          <InlineCode
            as={Link}
            data-cy="patch-base-commit"
            onClick={() => sendEvent({ name: "Click Base Commit Link" })}
            to={getVersionRoute(baseVersion?.id)}
          >
            {shortenGithash(revision)}
          </InlineCode>
        </MetadataItem>
      ) : (
        <MetadataItem>
          Previous commit:{" "}
          <InlineCode
            as={Link}
            data-cy="version-previous-commit"
            onClick={() => sendEvent({ name: "Click Previous Version Link" })}
            to={getVersionRoute(previousVersion?.id)}
          >
            {shortenGithash(previousVersion?.revision)}
          </InlineCode>
        </MetadataItem>
      )}
      {!isPatch && (
        <MetadataItem>
          GitHub commit:{" "}
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
            Commit queue position:{" "}
            {formatZeroIndexForDisplay(commitQueuePosition)}
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
      {url && displayName && (
        <MetadataItem>
          <StyledLink data-cy="external-link" href={url}>
            {displayName}
          </StyledLink>
        </MetadataItem>
      )}
      {gitTags && (
        <MetadataItem>
          {gitTags.map((g) => (
            <Disclaimer key={g.tag}>
              Tag {g.tag} pushed by {g.pusher}
            </Disclaimer>
          ))}
        </MetadataItem>
      )}
    </MetadataCard>
  );
};
