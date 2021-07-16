import { ApolloError } from "@apollo/client";
import styled from "@emotion/styled";
import { Skeleton } from "antd";
import { PageWrapper } from "components/styles";
import { MainlineCommitsQuery } from "gql/generated/types";
import { CommitChart } from "pages/commits/ActiveCommits/CommitChart";
import { CommitChartLabel } from "pages/commits/ActiveCommits/CommitChartLabel";
import {
  getAllTaskStatsGroupedByColor,
  findMaxGroupedTaskStats,
} from "pages/commits/ActiveCommits/utils";
import { ChartTypes } from "types/commits";
import { ChartToggle } from "./ActiveCommits/ChartToggle";
import { Grid } from "./ActiveCommits/Grid";
import { InactiveCommits, InactiveCommitLine } from "./InactiveCommits/index";

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
    const { max } = findMaxGroupedTaskStats(IdToTaskStatsGroupedByColor);

    return (
      <ProjectHealthWrapper>
        <FlexRowContainer>
          {versions.map((item) =>
            item.version ? (
              <ColumnContainer
                key={item.version.id}
                numCharts={versions.length}
              >
                <CommitChart
                  groupedTaskStats={
                    IdToTaskStatsGroupedByColor[item.version.id].stats
                  }
                  total={IdToTaskStatsGroupedByColor[item.version.id].total}
                  max={max}
                  chartType={chartType}
                />
                <CommitChartLabel
                  githash={item.version.revision.substring(0, 5)}
                  createTime={item.version.createTime}
                  author={item.version.author}
                  message={item.version.message}
                />
              </ColumnContainer>
            ) : (
              <ColumnContainer numCharts={versions.length}>
                <InactiveCommitLine />
                <InactiveCommits rolledUpVersions={item.rolledUpVersions} />
              </ColumnContainer>
            )
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
  padding-left: 9px;
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

interface ActiveCommitWrapperProps {
  numCharts: number;
}
export const ColumnContainer = styled.div<ActiveCommitWrapperProps>`
  width: ${({ numCharts }) => (1 / numCharts) * 100}%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
`;

const NoResults = styled.div`
  margin-top: 12px;
`;
