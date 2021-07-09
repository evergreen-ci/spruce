import React from "react";
import { ApolloError } from "@apollo/client";
import styled from "@emotion/styled";
import { Skeleton } from "antd";
import { PageWrapper } from "components/styles";
import { MainlineCommitsQuery } from "gql/generated/types";
import { ChartToggle } from "pages/commits/ActiveCommits/ChartToggle";
import { CommitChart } from "pages/commits/ActiveCommits/CommitChart";
import { CommitChartLabel } from "pages/commits/ActiveCommits/CommitChartLabel";
import { Grid } from "pages/commits/ActiveCommits/Grid";
import {
  getAllTaskStatsGroupedByColor,
  findMaxGroupedTaskStats,
} from "pages/commits/ActiveCommits/utils";
import { ChartTypes } from "types/commits";

interface Props {
  versions: MainlineCommitsQuery["mainlineCommits"]["versions"];
  error?: ApolloError;
  isLoading: boolean;
  chartType?: ChartTypes;
}

export const CommitsWrapper: React.FC<Props> = ({
  versions,
  isLoading,
  error,
  chartType,
}) => {
  if (error) {
    return <PageWrapper>ERROR</PageWrapper>;
  }
  if (isLoading) {
    return <StyledSkeleton active title={false} paragraph={{ rows: 6 }} />;
  }
  if (!isLoading && versions?.length !== 0) {
    const IdToTaskStatsGroupedByColor = getAllTaskStatsGroupedByColor(versions);
    const max = findMaxGroupedTaskStats(IdToTaskStatsGroupedByColor);

    return (
      <ProjectHealthWrapper>
        <FlexRowContainer>
          {versions.map((item) =>
            item.version ? (
              <ActiveCommitWrapper key={item.version.id}>
                <CommitChart
                  groupedTaskStats={
                    IdToTaskStatsGroupedByColor[item.version.id].stats
                  }
                  total={IdToTaskStatsGroupedByColor[item.version.id].total}
                  max={max}
                  chartType={ChartTypes.Absolute}
                />
                <CommitChartLabel
                  githash={item.version.id.substring(
                    item.version.id.length - 5
                  )}
                  createTime={item.version.createTime}
                  author={item.version.author}
                  message={item.version.message}
                />
              </ActiveCommitWrapper>
            ) : null
          )}
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
  align-items: flex-start;
  width: 100%;
  margin-top: 65px;
  z-index: 1;
  position: absolute;
`;

export const ProjectHealthWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  height: 100%;
  width: 100%;
  position: relative;
`;

// need to fix width to account for five active commits per page in future
export const ActiveCommitWrapper = styled.div`
  width: ${(1 / 7) * 100}%;
  display: flex;
  margin-left: 9px;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
`;

const NoResults = styled.div`
  margin-top: 12px;
`;
