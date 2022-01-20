import { useMemo } from "react";
import { ApolloError } from "@apollo/client";
import styled from "@emotion/styled";
import { Skeleton } from "antd";
import { MainlineCommitsQuery } from "gql/generated/types";
import { ChartTypes } from "types/commits";
import { ChartToggle } from "./ActiveCommits/ChartToggle";
import { Grid } from "./ActiveCommits/Grid";
import { ActiveCommit } from "./ActiveCommits/index";
import {
  getAllTaskStatsGroupedByColor,
  findMaxGroupedTaskStats,
} from "./ActiveCommits/utils";
import InactiveCommits from "./InactiveCommits";

interface Props {
  versions: MainlineCommitsQuery["mainlineCommits"]["versions"];
  error?: ApolloError;
  isLoading: boolean;
  chartType?: ChartTypes;
  hasTaskFilter: boolean;
  hasFilters: boolean;
  onChangeChartType: (chartType: ChartTypes) => void;
  containerRef?: React.RefObject<HTMLDivElement>;
}

export const CommitsWrapper: React.FC<Props> = ({
  versions,
  isLoading,
  error,
  chartType,
  hasTaskFilter,
  hasFilters,
  onChangeChartType,
  containerRef,
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
          {versions.map(({ version, rolledUpVersions }) =>
            version ? (
              <ActiveCommit
                key={version.id}
                version={version}
                chartType={chartType}
                total={versionToGroupedTaskStatsMap[version.id].total}
                max={max}
                groupedTaskStats={
                  versionToGroupedTaskStatsMap[version.id].stats
                }
                hasTaskFilter={hasTaskFilter}
                containerRef={containerRef}
              />
            ) : (
              <InactiveCommits
                key={rolledUpVersions[0].id}
                hasFilters={hasFilters}
                rolledUpVersions={rolledUpVersions}
                containerRef={containerRef}
              />
            )
          )}
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
  margin-top: 65px;
  padding: 0px 12px 0px 9px;
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
  margin-bottom: 40px;
`;

const NoResults = styled.div`
  margin-top: 12px;
`;
