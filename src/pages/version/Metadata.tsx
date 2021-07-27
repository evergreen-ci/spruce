import React from "react";
import { MetadataCard } from "components/MetadataCard";
import { StyledLink, StyledRouterLink } from "components/styles";
import { P2 } from "components/Typography";
import { getCommitQueueRoute, getProjectPatchesRoute } from "constants/routes";
import { environmentalVariables, string } from "utils";
import { ParametersModal } from "./ParametersModal";

const { msToDuration, getDateCopy } = string;
const { getUiUrl } = environmentalVariables;

interface Props {
  loading: boolean;
  version: {
    project: string;
    author: string;
    revision: string;
    createTime: Date;
    startTime?: Date;
    finishTime?: Date;
    projectIdentifier: string;
    baseVersionID?: string;
    versionTiming?: {
      makespan?: number;
      timeTaken?: number;
    };
    parameters: {
      key: string;
      value: string;
    }[];
    commitQueuePosition?: number;
    isPatch: boolean;
  };
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
    commitQueuePosition,
    projectIdentifier,
    baseVersionID,
    isPatch,
    parameters,
  } = version || {};
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
      <P2>Submitted at: {getDateCopy(createTime)}</P2>
      <P2>Started: {startTime && getDateCopy(startTime)}</P2>
      <P2>Finished: {finishTime && getDateCopy(finishTime)}</P2>
      <P2>{`Submitted by: ${author}`}</P2>
      {baseVersionID && revision && (
        <P2>
          <StyledLink
            data-cy="patch-base-commit"
            href={`${getUiUrl()}/version/${baseVersionID}`}
          >
            Base commit: {revision.slice(0, 10)}
          </StyledLink>
        </P2>
      )}
      {isPatch && commitQueuePosition !== undefined && (
        <P2>
          <StyledRouterLink
            data-cy="commit-queue-position"
            to={getCommitQueueRoute(project)}
          >
            Commit queue position: {commitQueuePosition}
          </StyledRouterLink>
        </P2>
      )}
      <ParametersModal parameters={parameters} />
    </MetadataCard>
  );
};
