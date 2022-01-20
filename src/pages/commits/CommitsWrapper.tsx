import { useMemo } from "react";
import { ApolloError } from "@apollo/client";
import styled from "@emotion/styled";
import { Skeleton } from "antd";
import { MainlineCommitsQuery } from "gql/generated/types";
import { ChartTypes } from "types/commits";
import { ChartToggle } from "./ActiveCommits/ChartToggle";
import { Grid } from "./ActiveCommits/Grid";
import {
  getAllTaskStatsGroupedByColor,
  findMaxGroupedTaskStats,
} from "./ActiveCommits/utils";
import { RenderCommitsChart, getCommitKey } from "./RenderCommit";

interface Props {
  versions: MainlineCommitsQuery["mainlineCommits"]["versions"];
  error?: ApolloError;
  isLoading: boolean;
  chartType?: ChartTypes;
  hasTaskFilter: boolean;
  hasFilters: boolean;
  onChangeChartType: (chartType: ChartTypes) => void;
}

export const CommitsWrapper: React.FC<Props> = ({
  versions,
  isLoading,
  error,
  chartType,
  hasTaskFilter,
  hasFilters,
  onChangeChartType,
}) => {
  const versionToGroupedTaskStatsMap = useMemo(() => {
    if (versions) {
      return getAllTaskStatsGroupedByColor(versions);
    }
    return undefined;
  }, [versions]);

  const maxGroupedTaskStats = useMemo(() => {
    if (versionToGroupedTaskStatsMap) {
      return findMaxGroupedTaskStats(versionToGroupedTaskStatsMap);
    }
    return undefined;
  }, [versionToGroupedTaskStatsMap]);

  const { max } = maxGroupedTaskStats || {};
  if (error) {
    return (
      <ProjectHealthWrapper>
        <Grid numDashedLine={5} />
      </ProjectHealthWrapper>
    );
  }
  if (isLoading) {
    return <StyledSkeleton active title={false} paragraph={{ rows: 6 }} />;
  }
  if (versions?.length !== 0) {
    return (
      <ProjectHealthWrapper>
        <FlexRowContainer numCommits={versions.length}>
          {versions.map((commit) => (
            <RenderCommitsChart
              hasTaskFilter={hasTaskFilter}
              key={getCommitKey(commit)}
              commit={commit}
              chartType={chartType}
              hasFilter={hasFilters}
              max={max}
              groupedResult={versionToGroupedTaskStatsMap}
            />
          ))}
        </FlexRowContainer>
        <Grid numDashedLine={5} />
        <ChartToggle
          currentChartType={chartType}
          onChangeChartType={onChangeChartType}
        />
      </ProjectHealthWrapper>
    );
  }
  return <NoResults data-cy="no-commits-found">No commits found</NoResults>;
};

const StyledSkeleton = styled(Skeleton)`
  margin-top: 12px;
`;

// If we have more than four commits, container should expand entire width
// Else they should align left
export const FlexRowContainer = styled.div<{ numCommits: number }>`
  width: ${({ numCommits }) => (numCommits > 4 ? 1 : numCommits / 7) * 100}%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;
  margin-top: 64px;
  padding: 0px 16px 0px 8px;
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

export const ColumnContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
`;

const NoResults = styled.div`
  margin-top: 12px;
`;
