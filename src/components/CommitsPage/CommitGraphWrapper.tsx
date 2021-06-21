import React from "react";
import { ApolloError } from "@apollo/client";
import styled from "@emotion/styled";
import { Skeleton } from "antd";
import { PageWrapper } from "components/styles";
import { MainlineCommitsQuery } from "gql/generated/types";
import { CommitGraph } from "./CommitGraph";

export const CommitGraphWrapper: React.FC<{
  versions: MainlineCommitsQuery["mainlineCommits"]["versions"];
  error?: ApolloError;
}> = ({ versions, error }) => {
  const taskCounts = [
    {
      success: 6,
      failure: 2,
      dispatched: 4,
      scheduled: 2,
      unscheduled: 5,
    },
  ];
  const taskCounts2 = [
    {
      success: 4,
      failure: 3,
      dispatched: 5,
      setupFailure: 2,
    },
  ];
  const taskCounts3 = [
    {
      success: 6,
    },
  ];
  const taskCounts4 = [
    {
      success: 3,
      failure: 4,
      dispatched: 6,
      scheduled: 5,
      unscheduled: 1,
      systemFailure: 4,
      setupFailure: 2,
    },
  ];
  const title = "Merge branch 'master' into CLOUDP-68157";
  const author = "Peter Vertenten";
  const createTime = "11/5/20 2:19 PM";
  const hash = "6b35c";
  if (error) {
    return <PageWrapper>ERROR</PageWrapper>;
  }
  if (!versions) {
    return <StyledSkeleton active title={false} paragraph={{ rows: 4 }} />;
  }
  if (versions?.length !== 0) {
    return (
      <>
        <FlexRowContainer>
          <CommitGraph
            taskCounts={taskCounts}
            createTime={createTime}
            hash={hash}
            title={title}
            author={author}
          />
          <CommitGraph
            taskCounts={taskCounts2}
            createTime={createTime}
            hash={hash}
            title={title}
            author={author}
          />
          <CommitGraph
            taskCounts={taskCounts3}
            createTime={createTime}
            hash={hash}
            title={title}
            author={author}
          />
          <CommitGraph
            taskCounts={taskCounts}
            createTime={createTime}
            hash={hash}
            title={title}
            author={author}
          />
          <CommitGraph
            taskCounts={taskCounts}
            createTime={createTime}
            hash={hash}
            title={title}
            author={author}
          />
          <CommitGraph
            taskCounts={taskCounts4}
            createTime={createTime}
            hash={hash}
            title={title}
            author={author}
          />
          <CommitGraph
            taskCounts={taskCounts}
            createTime={createTime}
            hash={hash}
            title={title}
            author={author}
          />
        </FlexRowContainer>
      </>
    );
  }
};

const StyledSkeleton = styled(Skeleton)`
  margin-top: 12px;
`;

const FlexRowContainer = styled.div`
  display: flex;
  contents-direction: row;
  justify-content: flex-start;
  align-items: flex-end;
`;
