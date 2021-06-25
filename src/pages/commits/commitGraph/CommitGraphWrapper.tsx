import React from "react";
import { ApolloError } from "@apollo/client";
import styled from "@emotion/styled";
import { Skeleton } from "antd";
import { PageWrapper } from "components/styles";
import { CommitGraph, TaskCounts } from "pages/commits/commitGraph/CommitGraph";

export const CommitGraphWrapper: React.FC<{
  taskCounts: TaskCounts[];
  error?: ApolloError;
  graphType: "percentage" | "absolute";
  isLoading: boolean;
}> = ({ taskCounts, isLoading, error, graphType }) => {
  if (error) {
    return <PageWrapper>ERROR</PageWrapper>;
  }

  if (isLoading) {
    return <StyledSkeleton active title={false} paragraph={{ rows: 6 }} />;
  }
  if (!isLoading && taskCounts?.length !== 0) {
    return (
      <>
        <FlexRowContainer>
          {taskCounts.map((value) => (
            <CommitGraph
              taskCounts={value}
              max={graphType === "absolute" ? findMax(taskCounts) : -1}
              graphType={graphType}
            />
          ))}
        </FlexRowContainer>
      </>
    );
  }
  return <NoResults data-cy="no-commits-found">No commits found</NoResults>;
};

const StyledSkeleton = styled(Skeleton)`
  margin-top: 12px;
`;

const FlexRowContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: flex-end;
  height: 222px;
  width: 100%;
`;

const NoResults = styled.div`
  margin-top: 12px;
`;

function findMax(data: TaskCounts[]) {
  const allCounts = data.reduce(
    (accumulator, curr) => [...accumulator, ...Object.values(curr)],
    []
  );
  return Math.max(...allCounts);
}
