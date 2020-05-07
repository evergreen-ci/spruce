import React from "react";
import styled from "@emotion/styled";
import { PageWrapper } from "components/PageWrapper";
import { useParams } from "react-router-dom";
import Badge from "@leafygreen-ui/badge";
import { uiColors } from "@leafygreen-ui/palette";
import { Body } from "@leafygreen-ui/typography";
import { useQuery } from "@apollo/react-hooks";
import get from "lodash/get";
import { Skeleton } from "antd";
import { PageTitle } from "components/PageTitle";
import { ErrorWrapper } from "components/ErrorWrapper";
import { CommitQueueCard } from "./commitqueue/CommitQueueCard";
import { GET_COMMIT_QUEUE } from "gql/queries/get-commit-queue";
import {
  CommitQueueQuery,
  CommitQueueQueryVariables,
} from "gql/generated/types";

const { gray } = uiColors;

export const CommitQueue: React.FC = () => {
  const { id } = useParams();
  const { data, loading, error } = useQuery<
    CommitQueueQuery,
    CommitQueueQueryVariables
  >(GET_COMMIT_QUEUE, {
    variables: { id },
  });
  if (loading) {
    return <Skeleton active={true} title={true} paragraph={{ rows: 4 }} />;
  }
  if (error) {
    return (
      <ErrorWrapper data-cy="commitQueue-card-error">
        {error.message}
      </ErrorWrapper>
    );
  }
  const commitQueue = get(data, "commitQueue");
  const queue = get(commitQueue, "queue");
  return (
    <PageWrapper>
      <PageTitle
        title="Commit Queue"
        badge={
          <Badge variant="darkgray">
            {buildBadgeString(queue ? queue.length : 0)}
          </Badge>
        }
        loading={false}
        hasData={true}
      />
      <HR />
      {queue &&
        queue.map((queueItems, i) => (
          <CommitQueueCard
            key={queueItems.issue}
            index={i + 1}
            title={queueItems.patch && queueItems.patch.description}
            author={queueItems.patch && queueItems.patch.author}
            patchId={queueItems.patch && queueItems.patch.id}
            commitTime={queueItems.enqueueTime}
            moduleCodeChanges={
              queueItems.patch && queueItems.patch.moduleCodeChanges
            }
            commitQueueId={commitQueue.projectId}
          />
        ))}
      {!queue && <Body>There are no items in this queue. </Body>}
    </PageWrapper>
  );
};

const HR = styled("hr")`
  background-color: ${gray.light2};
  border: 0;
  height: 3px;
`;

const buildBadgeString = (queueLength: number): string => {
  if (queueLength !== 1) {
    return `${queueLength} Items`;
  } else {
    return `${queueLength} Item`;
  }
};
