import React from "react";
import { ApolloError } from "@apollo/client";
import styled from "@emotion/styled";
import { Array } from "@ungap/global-this";
import { Skeleton } from "antd";
import { PageWrapper } from "components/styles";
import { MainlineCommitsQuery } from "gql/generated/types";
import { CommitGraph } from "./CommitGraph";

export const CommitGraphWrapper: React.FC<{
  versions: MainlineCommitsQuery["mainlineCommits"]["versions"];
  error?: ApolloError;
  graphType: "percentage" | "absolute";
}> = ({ versions, error, graphType }) => {
  let max = -1;
  if (error) {
    return <PageWrapper>ERROR</PageWrapper>;
  }
  if (!versions) {
    return <StyledSkeleton active title={false} paragraph={{ rows: 4 }} />;
  }
  if (graphType === "absolute") {
    max = findMax(data);
  }
  if (versions?.length !== 0) {
    return (
      <>
        <FlexRowContainer>
          {data.map((value) => (
            <CommitGraph taskCounts={value} max={max} graphType={graphType} />
          ))}
        </FlexRowContainer>
      </>
    );
  }
  return <NoResults data-cy="no-patches-found">No commits found</NoResults>;
};

const StyledSkeleton = styled(Skeleton)`
  margin-top: 12px;
`;

const FlexRowContainer = styled.div`
  display: flex;
  contents-direction: row;
  justify-content: flex-start;
  align-items: flex-end;
  height: 222px;
  width: 100%;
`;

const NoResults = styled.div`
  margin-top: 12px;
`;

function findMax(data: Array<Object>) {
  let max = -1;
  data.forEach((item) => {
    max = Math.max(
      max,
      Math.max.apply(
        null,
        Object.keys(item).map((x) => item[x])
      )
    );
  });
  return max;
}

// Hard-coded data for now:
const data = [
  {
    success: 6,
    failure: 2,
    dispatched: 4,
    scheduled: 2,
    unscheduled: 5,
    total: 19,
    max: 6,
  },
  {
    success: 4,
    failure: 3,
    dispatched: 5,
    setupFailure: 2,
    total: 14,
    max: 5,
  },
  {
    success: 30,
    total: 30,
    max: 30,
  },
  {
    success: 3,
    failure: 4,
    dispatched: 6,
    scheduled: 5,
    unscheduled: 1,
    systemFailure: 4,
    setupFailure: 2,
    total: 25,
    max: 6,
  },
  {
    success: 6,
    failure: 2,
    unscheduled: 5,
    total: 13,
    max: 6,
  },
  {
    success: 4,
    failure: 3,
    dispatched: 5,
    total: 12,
    max: 5,
  },
  {
    success: 10,
    failure: 20,
    total: 30,
    max: 20,
  },
];
