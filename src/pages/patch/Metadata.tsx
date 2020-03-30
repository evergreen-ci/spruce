import React from "react";
import { Skeleton } from "antd";
import { P2 } from "components/Typography";
import { StyledLink } from "components/styles";
import { Patch } from "gql/queries/patch";
import { getUiUrl } from "utils/getEnvironmentVariables";
import { ApolloError } from "apollo-client";
import { MetadataCard } from "components/MetadataCard";

interface Props {
  loading: boolean;
  error: ApolloError;
  patch: Patch;
}
const CARD_TITLE = "Patch Metadata";

export const Metadata: React.FC<Props> = ({ loading, patch, error }) => {
  if (loading) {
    return (
      <MetadataCard title={CARD_TITLE}>
        <Skeleton active={true} title={false} paragraph={{ rows: 4 }} />
      </MetadataCard>
    );
  }
  if (error) {
    // TODO: replace with actual error message display
    return (
      <MetadataCard title={CARD_TITLE}>
        <div id="patch-error">{error.message}</div>
      </MetadataCard>
    );
  }
  const {
    author,
    githash,
    version,
    time: { submittedAt, started, finished },
    duration: { makespan, timeTaken }
  } = patch;

  return (
    <MetadataCard title={CARD_TITLE}>
      <P2>Makespan: {makespan && makespan}</P2>
      <P2>Time taken: {timeTaken && timeTaken}</P2>
      <P2>Submitted at: {submittedAt}</P2>
      <P2>Started: {started && started}</P2>
      <P2>Finished: {finished && finished}</P2>
      <P2>{`Submitted by: ${author}`}</P2>
      <P2>
        <StyledLink
          id="patch-base-commit"
          href={`${getUiUrl()}/version/${version}`}
        >
          Base commit: {githash.slice(0, 10)}
        </StyledLink>
      </P2>
    </MetadataCard>
  );
};
