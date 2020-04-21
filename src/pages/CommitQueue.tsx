import React from "react";
import styled from "@emotion/styled";
import { PageWrapper } from "components/styles";
import { useParams } from "react-router-dom";
import { Subtitle } from "@leafygreen-ui/typography";
import Badge from "@leafygreen-ui/badge";
import { uiColors } from "@leafygreen-ui/palette";
import { useQuery } from "@apollo/react-hooks";
import get from "lodash/get";
import { Skeleton } from "antd";

import { CommitQueueCard } from "./commitqueue/CommitQueueCard";
import {
  GET_COMMIT_QUEUE,
  CommitQueueQuery,
} from "gql/queries/get-commit-queue";

const { gray } = uiColors;

export const CommitQueue = () => {
  const { id } = useParams();
  const { data, loading, error } = useQuery<CommitQueueQuery>(
    GET_COMMIT_QUEUE,
    {
      variables: { id: id },
    }
  );
  if (loading) {
    return <Skeleton active={true} title={true} paragraph={{ rows: 4 }} />;
  }
  if (error) {
    return (
      <ErrorWrapper data-cy="metadata-card-error">{error.message}</ErrorWrapper>
    );
  }
  const commitQueue = get(data, "commitQueue");
  const queue = get(commitQueue, "queue");
  return (
    <PageWrapper>
      <Header>
        <PageTitle> Commit Queue </PageTitle>
        <Badge variant="darkgray">
          {queue.length} Item {queue.length > 1 && "s"}
        </Badge>
      </Header>
      <HR />
      {queue.map((queueItems, i) => (
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
        />
      ))}
    </PageWrapper>
  );
};

const Header = styled("div")`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-top: 24px;
  margin-bottom: 16px;
`;
const PageTitle = styled(Subtitle)`
  margin-right: 16px;
  font-size: 18px;
`;

const HR = styled("hr")`
  background-color: ${gray.light2};
  border: 0;
  height: 3px;
`;

const ErrorWrapper = styled("div")`
  word-wrap: break-word;
`;
