import React from "react";
import { ApolloError } from "@apollo/client";
import { MetadataCard } from "components/MetadataCard";
import { StyledLink } from "components/styles";
import { P2 } from "components/Typography";
import { getCommitQueueRoute, getProjectPatchesRoute } from "constants/routes";
import { PatchQuery } from "gql/generated/types";
import { getUiUrl } from "utils/getEnvironmentVariables";
import { ParametersModal } from "./ParametersModal";

interface Props {
  loading: boolean;
  error: ApolloError;
  patch: PatchQuery["patch"];
}

export const Metadata: React.FC<Props> = ({ loading, patch, error }) => {
  const {
    author,
    githash,
    time,
    duration,
    projectID,
    projectIdentifier,
    baseVersionID,
    commitQueuePosition,
    parameters,
  } = patch || {};
  const { submittedAt, started, finished } = time || {};
  const { makespan, timeTaken } = duration || {};
  return (
    <MetadataCard loading={loading} error={error} title="Patch Metadata">
      <P2>
        Project:{" "}
        <StyledLink href={getProjectPatchesRoute(projectID)}>
          {projectIdentifier}
        </StyledLink>
      </P2>
      <P2>Makespan: {makespan && makespan}</P2>
      <P2>Time taken: {timeTaken && timeTaken}</P2>
      <P2>Submitted at: {submittedAt}</P2>
      <P2>Started: {started && started}</P2>
      <P2>Finished: {finished && finished}</P2>
      <P2>{`Submitted by: ${author}`}</P2>
      {baseVersionID && githash && (
        <P2>
          <StyledLink
            data-cy="patch-base-commit"
            href={`${getUiUrl()}/version/${baseVersionID}`}
          >
            Base commit: {githash.slice(0, 10)}
          </StyledLink>
        </P2>
      )}
      {commitQueuePosition !== null && (
        <P2>
          <StyledLink
            data-cy="commit-queue-position"
            href={getCommitQueueRoute(projectID)}
          >
            Commit queue position: {commitQueuePosition}
          </StyledLink>
        </P2>
      )}
      <ParametersModal parameters={parameters} />
    </MetadataCard>
  );
};
