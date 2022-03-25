import { useVersionAnalytics } from "analytics";
import { MetadataCard } from "components/MetadataCard";
import { StyledRouterLink } from "components/styles";
import { P2 } from "components/Typography";
import {
  getCommitQueueRoute,
  getProjectPatchesRoute,
  getVersionRoute,
} from "constants/routes";
import { VersionQuery } from "gql/generated/types";
import { string } from "utils";
import ManifestBlob from "./ManifestBlob";
import { ParametersModal } from "./ParametersModal";

const { msToDuration, getDateCopy } = string;

interface Props {
  loading: boolean;
  version: VersionQuery["version"];
}

export const Metadata: React.FC<Props> = ({ loading, version }) => {
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
  } = version || {};
  const { sendEvent } = useVersionAnalytics(id);
  const { commitQueuePosition } = patch || {};
  const { makespan, timeTaken } = versionTiming || {};
  return (
    <MetadataCard
      loading={loading}
      error={null}
      title={isPatch ? "Patch Metadata" : "Version Metadata"}
    >
      <P2>
        Project:{" "}
        <StyledRouterLink to={getProjectPatchesRoute(project)}>
          {projectIdentifier}
        </StyledRouterLink>
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
          <StyledRouterLink
            data-cy="patch-base-commit"
            to={getVersionRoute(baseVersion?.id)}
            onClick={() => sendEvent({ name: "Click Base Commit Link" })}
          >
            {revision.slice(0, 10)}
          </StyledRouterLink>
        </P2>
      ) : (
        <P2>
          Previous commit:{" "}
          <StyledRouterLink
            data-cy="version-previous-commit"
            to={getVersionRoute(previousVersion?.id)}
            onClick={() => sendEvent({ name: "Click Previous Version Link" })}
          >
            {previousVersion?.revision.slice(0, 10)}
          </StyledRouterLink>
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
      <ParametersModal parameters={parameters} />
    </MetadataCard>
  );
};
