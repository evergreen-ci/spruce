import { useMemo } from "react";
import { ApolloError } from "@apollo/client";
import styled from "@emotion/styled";
import { uiColors } from "@leafygreen-ui/palette";
import { Skeleton } from "antd";
import { size } from "constants/tokens";

import { ChartTypes, Commit, Commits } from "types/commits";
import { ChartToggle } from "./ActiveCommits/ChartToggle";
import { Grid } from "./ActiveCommits/Grid";
import {
  getAllTaskStatsGroupedByColor,
  findMaxGroupedTaskStats,
} from "./ActiveCommits/utils";
import {
  RenderCommitsChart,
  RenderCommitsLabel,
  getCommitKey,
  RenderCommitsBuildVariants,
} from "./RenderCommit";

const { white } = uiColors;

interface Props {
  versions: Commits;
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
  }, [versions]);

  const maxGroupedTaskStats = useMemo(() => {
    if (versionToGroupedTaskStatsMap) {
      return findMaxGroupedTaskStats(versionToGroupedTaskStatsMap);
    }
  }, [versionToGroupedTaskStatsMap]);

  const { max } = maxGroupedTaskStats || {};
  if (error) {
    return (
      <ChartWrapper>
        <Grid numDashedLine={5} />
      </ChartWrapper>
    );
  }
  if (isLoading) {
    return <StyledSkeleton active title={false} paragraph={{ rows: 6 }} />;
  }

  const widths = versions.map((commit) => getCommitWidth(commit));
  if (versions) {
    return (
      <>
        <ChartWrapper>
          <FlexRowContainer>
            {versions.map((commit, i) => (
              <CommitWrapper key={getCommitKey(commit)} width={widths[i]}>
                <RenderCommitsChart
                  hasTaskFilter={hasTaskFilter}
                  commit={commit}
                  chartType={chartType}
                  max={max}
                  groupedResult={versionToGroupedTaskStatsMap}
                />
              </CommitWrapper>
            ))}
          </FlexRowContainer>
          <Grid numDashedLine={5} />
          <AbsoluteContainer>
            <ChartToggle
              currentChartType={chartType}
              onChangeChartType={onChangeChartType}
            />
          </AbsoluteContainer>
        </ChartWrapper>
        <StickyContainer>
          <FlexRowContainer>
            {versions.map((commit, i) => (
              <CommitWrapper key={getCommitKey(commit)} width={widths[i]}>
                <RenderCommitsLabel commit={commit} hasFilters={hasFilters} />
              </CommitWrapper>
            ))}
          </FlexRowContainer>
        </StickyContainer>
        <FlexRowContainer>
          {versions.map((commit, i) => (
            <CommitWrapper key={getCommitKey(commit)} width={widths[i]}>
              <RenderCommitsBuildVariants
                commit={commit}
                hasTaskFilter={hasTaskFilter}
              />
            </CommitWrapper>
          ))}
        </FlexRowContainer>
      </>
    );
  }
  return <NoResults data-cy="no-commits-found">No commits found</NoResults>;
};

const getCommitWidth = (commit: Commit) => {
  const { version, rolledUpVersions } = commit;
  if (version) {
    return 200;
  }
  if (rolledUpVersions) {
    return 64;
  }
  throw new Error("Commit type not found");
};

const StickyContainer = styled.div`
  position: sticky;
  top: -${size.m}; // This is to offset the padding of PageWrapper
  z-index: 1;
  background-color: ${white};
  margin-top: ${size.xxs};
  margin-bottom: ${size.xs};
`;

const StyledSkeleton = styled(Skeleton)`
  margin-top: 12px;
`;

const FlexRowContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;
`;

const AbsoluteContainer = styled.div`
  position: absolute;
  top: -${size.l};
  right: 0;
  left: auto;
`;

const CommitWrapper = styled.div<{ width: number }>`
  width: ${({ width }) => width}px;
`;

const ChartWrapper = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
`;

const NoResults = styled.div`
  margin-top: 12px;
`;
