import React from "react";
import { useQuery } from "@apollo/client";
import styled from "@emotion/styled";
import { uiColors } from "@leafygreen-ui/palette";
import { Body } from "@leafygreen-ui/typography";
import get from "lodash/get";
import { useParams } from "react-router-dom";
import Badge from "components/Badge";
import { PageTitle } from "components/PageTitle";
import { PageWrapper } from "components/styles";
import { P1 } from "components/Typography";
import { useToastContext } from "context/toast";
import {
  CommitQueueQuery,
  CommitQueueQueryVariables,
} from "gql/generated/types";
import { GET_COMMIT_QUEUE } from "gql/queries/get-commit-queue";
import { usePageTitle } from "hooks";
import { CommitQueueCard } from "./commitqueue/CommitQueueCard";

const { gray } = uiColors;

export const CommitQueue: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatchToast = useToastContext();
  const { data, loading } = useQuery<
    CommitQueueQuery,
    CommitQueueQueryVariables
  >(GET_COMMIT_QUEUE, {
    variables: { id },
    onError: (err) => {
      dispatchToast.error(
        `There was an error loading the commit queue: ${err.message}`
      );
    },
  });

  const commitQueue = get(data, "commitQueue");
  const queue = get(commitQueue, "queue");
  usePageTitle(`Commit Queue - ${id}`);
  return (
    <PageWrapper>
      <PageTitle
        title="Commit Queue"
        badge={
          <Badge variant="darkgray">
            {buildBadgeString(queue ? queue.length : 0)}
          </Badge>
        }
        loading={loading}
        hasData
      />
      {commitQueue?.message && (
        <P1 data-cy="commit-queue-message">{commitQueue.message}</P1>
      )}
      <HR />
      {queue &&
        queue.map((queueItems, i) => (
          <CommitQueueCard
            key={queueItems.issue}
            issue={queueItems.issue}
            index={i + 1}
            title={queueItems.patch && queueItems.patch.description}
            author={queueItems.patch && queueItems.patch.author}
            patchId={queueItems.patch && queueItems.patch.id}
            repo={commitQueue?.repo}
            owner={commitQueue?.owner}
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
  }
  return `${queueLength} Item`;
};
