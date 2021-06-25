import React from "react";
import { ApolloError } from "@apollo/client";
import styled from "@emotion/styled";
import { uiColors } from "@leafygreen-ui/palette";
import { Skeleton } from "antd";
import { PageWrapper } from "components/styles";
import { MainlineCommitsQuery } from "gql/generated/types";

const { gray } = uiColors;

export const CommitsWrapper: React.FC<{
  versions: MainlineCommitsQuery["mainlineCommits"]["versions"];
  error?: ApolloError;
  chartType: "percentage" | "absolute";
  isLoading: boolean;
}> = ({ versions, isLoading, error }) => {
  if (error) {
    return <PageWrapper>ERROR</PageWrapper>;
  }
  if (isLoading) {
    return <StyledSkeleton active title={false} paragraph={{ rows: 6 }} />;
  }
  if (!isLoading && versions?.length !== 0) {
    return (
      <Container>
        <FlexRowContainer />
        <ColumnContainer>
          <DashedLine />
          <DashedLine />
          <DashedLine />
          <DashedLine />
          <DashedLine />
          <SolidLine />
        </ColumnContainer>
      </Container>
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

const Container = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: flex-end;
  height: 222px;
  width: 100%;
  position: relative;
`;

const ColumnContainer = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-end;
`;
const DashedLine = styled.div`
  width: 100%;
  border: 1px dashed ${gray.light2};
`;

const SolidLine = styled.div`
  width: 100%;
  border: 1px solid ${gray.light1};
`;

const NoResults = styled.div`
  margin-top: 12px;
`;

// function findMaxTaskStats(data: TaskStats[]) {
//   const allCounts = data.reduce(
//     (accumulator, curr) => [...accumulator, ...Object.values(curr)],
//     []
//   );
//   return Math.max(...allCounts);
// }
