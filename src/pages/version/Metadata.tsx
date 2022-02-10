import React from "react";
import { useParams } from "react-router-dom";
import { useVersionAnalytics } from "analytics";
import { MetadataCard } from "components/MetadataCard";
import { StyledRouterLink } from "components/styles";
import { P2 } from "components/Typography";
import {
  getCommitQueueRoute,
  getProjectPatchesRoute,
  getVersionRoute,
} from "constants/routes";
import { string } from "utils";
import ManifestBlob from "./ManifestBlob";
import { ParametersModal } from "./ParametersModal";

const { msToDuration, getDateCopy } = string;

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
    commitQueuePosition?: number;
    isPatch: boolean;
    parameters: {
      key: string;
      value: string;
    }[];
    manifest?: {
      id: string;
      revision: string;
      project: string;
      branch: string;
      isBase: boolean;
      moduleOverrides?: {
        [key: string]: string;
      };
      modules?: {
        [key: string]: {
          [key: string]: string;
        };
      };
    };
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
    manifest,
  } = version || {};
  const { id } = useParams<{ id: string }>();
  const { sendEvent } = useVersionAnalytics(id);

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
      {baseVersionID && revision && (
        <P2>
          Base commit:{" "}
          <StyledRouterLink
            data-cy="patch-base-commit"
            to={getVersionRoute(baseVersionID)}
            onClick={() => sendEvent({ name: "Click Base Commit Link" })}
          >
            {revision.slice(0, 10)}
          </StyledRouterLink>
        </P2>
      )}
      {isPatch && commitQueuePosition !== undefined && (
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
