import React from "react";
import { ApolloError } from "@apollo/client";
import styled from "@emotion/styled";
import { Skeleton } from "antd";
import { useParams } from "react-router-dom";
import { PageWrapper } from "components/styles";
import { MainlineCommitsQuery } from "gql/generated/types";
import { ChartToggle } from "pages/commits/commitChart/ChartToggle";
import { CommitChart } from "pages/commits/commitChart/CommitChart";
import {
  groupedTaskData,
  max,
} from "pages/commits/commitChart/CommitChart.stories";
import { Grid } from "pages/commits/commitChart/Grid";
import { GroupedResult } from "pages/commits/commitChart/utils";

interface Props {
  versions: MainlineCommitsQuery["mainlineCommits"]["versions"];
  error?: ApolloError;
  isLoading: boolean;
  chartType?: ChartTypes;
}

export enum ChartTypes {
  Absolute = "absolute",
  Percentage = "percentage",
}

export const CommitsWrapper: React.FC<Props> = ({
  versions,
  isLoading,
  error,
  chartType = ChartTypes.Absolute,
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
        <FlexRowContainer>
          {groupedTaskData.map((item) => (
            <CommitChart
              groupedTaskStats={item.stats}
              total={item.total}
              max={max}
              chartType={chartType}
            />
          ))}
        </FlexRowContainer>
        <Grid numDashedLine={5} />
        <ChartToggle currentChartType={chartType} />
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

export function findMaxGroupedTaskStats(taskData: GroupedResult[]) {
  const maxes = taskData.map((data) => data.max);
  return Math.max(...maxes);
}
