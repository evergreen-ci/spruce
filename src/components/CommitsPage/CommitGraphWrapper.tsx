import React from "react";
import { ApolloError } from "@apollo/client";
import styled from "@emotion/styled";
import { Skeleton } from "antd";
import { PageWrapper } from "components/styles";
import { MainlineCommitsQuery } from "gql/generated/types";
import { CommitGraph } from "./CommitGraph";
import { CommitGraphHTML } from "./CommitGraphHTML";

export const CommitGraphWrapper: React.FC<{
  versions: MainlineCommitsQuery["mainlineCommits"]["versions"];
  error?: ApolloError;
}> = ({ versions, error }) => {
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
          <CommitGraph taskCounts={taskCounts} />
          <CommitGraph taskCounts={taskCounts2} />
          <CommitGraph taskCounts={taskCounts3} />
          <CommitGraph taskCounts={taskCounts2} />
          <CommitGraph taskCounts={taskCounts} />
          <CommitGraph taskCounts={taskCounts4} />
          <CommitGraph taskCounts={taskCounts3} />
        </FlexRowContainer>
        <FlexRowContainer>
          <CommitGraphHTML taskCounts={taskCountsHTML} />
          <CommitGraphHTML taskCounts={taskCountsHTML2} />
          <CommitGraphHTML taskCounts={taskCountsHTML3} />
          <CommitGraphHTML taskCounts={taskCountsHTML2} />
          <CommitGraphHTML taskCounts={taskCountsHTML} />
          <CommitGraphHTML taskCounts={taskCountsHTML4} />
          <CommitGraphHTML taskCounts={taskCountsHTML3} />
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
  height: 240px;
`;

const taskCounts = {
  success: 6,
  failure: 2,
  dispatched: 4,
  scheduled: 2,
  unscheduled: 5,
};
const taskCounts2 = {
  success: 4,
  failure: 3,
  dispatched: 5,
  setupFailure: 2,
};
const taskCounts3 = {
  success: 6,
};
const taskCounts4 = {
  success: 3,
  failure: 4,
  dispatched: 6,
  scheduled: 5,
  unscheduled: 1,
  systemFailure: 4,
  setupFailure: 2,
};

const taskCountsHTML = {
  success: 6,
  failure: 2,
  dispatched: 4,
  scheduled: 2,
  unscheduled: 5,
  total: 19,
};
const taskCountsHTML2 = {
  success: 4,
  failure: 3,
  dispatched: 5,
  setupFailure: 2,
  total: 14,
};
const taskCountsHTML3 = {
  success: 6,
  total: 6,
};
const taskCountsHTML4 = {
  success: 3,
  failure: 4,
  dispatched: 6,
  scheduled: 5,
  unscheduled: 1,
  systemFailure: 4,
  setupFailure: 2,
  total: 25,
};
