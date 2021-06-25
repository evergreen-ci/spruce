import React from "react";
import { ApolloError } from "@apollo/client";
import styled from "@emotion/styled";
import { Skeleton } from "antd";
import { PageWrapper } from "components/styles";
import { MainlineCommitsQuery } from "gql/generated/types";
<<<<<<< HEAD:src/components/CommitsPage/CommitGraphWrapper.tsx
import { CommitGraph } from "./CommitGraph";
=======
>>>>>>> changed taskCounts to taskStats, changed wrapper file name:src/pages/commits/commitGraph/CommitsWrapper.tsx

export const CommitGraphWrapper: React.FC<{
  versions: MainlineCommitsQuery["mainlineCommits"]["versions"];
  error?: ApolloError;
  graphType: "percentage" | "absolute";
  isLoading: boolean;
<<<<<<< HEAD:src/components/CommitsPage/CommitGraphWrapper.tsx
}> = ({ versions, isLoading, error, graphType }) => {
=======
}> = ({ versions, isLoading, error }) => {
>>>>>>> changed taskCounts to taskStats, changed wrapper file name:src/pages/commits/commitGraph/CommitsWrapper.tsx
  if (error) {
    return <PageWrapper>ERROR</PageWrapper>;
  }

  if (isLoading) {
    return <StyledSkeleton active title={false} paragraph={{ rows: 6 }} />;
  }
  if (!isLoading && versions?.length !== 0) {
    return (
      <>
<<<<<<< HEAD:src/components/CommitsPage/CommitGraphWrapper.tsx
        <FlexRowContainer>
          {data.map((value) => (
            <CommitGraph
              taskCounts={value}
              max={graphType === "absolute" ? findMax(data) : -1}
              graphType={graphType}
            />
          ))}
        </FlexRowContainer>
=======
        <FlexRowContainer />
>>>>>>> changed taskCounts to taskStats, changed wrapper file name:src/pages/commits/commitGraph/CommitsWrapper.tsx
      </>
    );
  }
  return <NoResults data-cy="no-commits-found">No commits found</NoResults>;
};

const StyledSkeleton = styled(Skeleton)`
  margin-top: 12px;
`;

export const FlexRowContainer = styled.div`
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

<<<<<<< HEAD:src/components/CommitsPage/CommitGraphWrapper.tsx
function findMax(data: TaskCounts[]) {
  const allCounts = data.reduce(
    (accumulator, curr) => [...accumulator, ...Object.values(curr)],
    []
  );
  return Math.max(...allCounts);
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
=======
// function findMaxTaskStats(data: TaskStats[]) {
//   const allCounts = data.reduce(
//     (accumulator, curr) => [...accumulator, ...Object.values(curr)],
//     []
//   );
//   return Math.max(...allCounts);
// }
>>>>>>> changed taskCounts to taskStats, changed wrapper file name:src/pages/commits/commitGraph/CommitsWrapper.tsx
