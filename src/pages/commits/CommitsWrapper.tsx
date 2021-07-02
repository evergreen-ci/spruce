import React from "react";
import { ApolloError } from "@apollo/client";
import styled from "@emotion/styled";
import { Skeleton } from "antd";
import { PageWrapper } from "components/styles";
import { MainlineCommitsQuery } from "gql/generated/types";
import { ChartToggle, ChartTypes } from "pages/commits/commitChart/ChartToggle";
import { Grid } from "pages/commits/commitChart/Grid";
import { GroupedResult } from "pages/commits/commitChart/utils";

interface Props {
  versions: MainlineCommitsQuery["mainlineCommits"]["versions"];
  error?: ApolloError;
  isLoading: boolean;
}

export const CommitsWrapper: React.FC<Props> = ({
  versions,
  isLoading,
  error,
}) => {
  if (error) {
    return <PageWrapper>ERROR</PageWrapper>;
  }
  if (isLoading) {
    return <StyledSkeleton active title={false} paragraph={{ rows: 6 }} />;
  }
  if (!isLoading && versions?.length !== 0) {
    return (
      <ProjectHealthWrapper>
        <FlexRowContainer />
        <Grid numDashedLine={5} />
        <ChartToggle currentChartType={ChartTypes.Absolute} />
      </ProjectHealthWrapper>
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
  height: 224px;
  width: 100%;
  z-index: 1;
  position: absolute;
`;

export const ProjectHealthWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: flex-end;
  height: 285px;
  width: 100%;
  position: relative;
`;

const NoResults = styled.div`
  margin-top: 12px;
`;

export function findMaxGroupedTaskStats(groupedTaskData: GroupedResult[]) {
  const maxes = groupedTaskData.map((data) => data.max);
  return Math.max(...maxes);
}
