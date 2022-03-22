import { useMemo } from "react";
import { ApolloError } from "@apollo/client";
import styled from "@emotion/styled";
import { uiColors } from "@leafygreen-ui/palette";
import { Skeleton } from "antd";
import { useLocation } from "react-router-dom";
import { size } from "constants/tokens";
import { useUpdateURLQueryParams } from "hooks";
import {
  ChartTypes,
  Commit,
  Commits,
  ChartToggleQueryParams,
} from "types/commits";
import { queryString } from "utils";
import { ChartToggle } from "./ActiveCommits/ChartToggle";
import { Grid } from "./ActiveCommits/Grid";
import { GridLabel } from "./ActiveCommits/GridLabel";
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

const { parseQueryString, getString } = queryString;
const { white } = uiColors;

const DEFAULT_CHART_TYPE = ChartTypes.Absolute;

interface Props {
  versions: Commits;
  error?: ApolloError;
  isLoading: boolean;
  hasTaskFilter: boolean;
  hasFilters: boolean;
}

export const CommitsWrapper: React.FC<Props> = ({
  versions,
  isLoading,
  error,
  hasTaskFilter,
  hasFilters,
}) => {
  const { search } = useLocation();
  const updateQueryParams = useUpdateURLQueryParams();
  const parsed = parseQueryString(search);

  const onChangeChartType = (chartType: ChartTypes): void => {
    updateQueryParams({
      [ChartToggleQueryParams.chartType]: chartType,
    });
  };

  const chartType =
    (getString(parsed[ChartToggleQueryParams.chartType]) as ChartTypes) ||
    DEFAULT_CHART_TYPE;

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
      <ChartContainer>
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
          <GridLabel chartType={chartType} max={max} numDashedLine={5} />
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
              <RenderCommitsBuildVariants commit={commit} />
            </CommitWrapper>
          ))}
        </FlexRowContainer>
      </ChartContainer>
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

const ChartContainer = styled.div`
  padding: 0 ${size.m};
`;

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
  min-width: ${({ width }) => width * 0.75}px;
  margin: 0px ${size.xs};

  &:first-of-type {
    margin-left: 0;
  }
  &:last-of-type {
    margin-right: 0;
  }
`;

const ChartWrapper = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
`;

const NoResults = styled.div`
  margin-top: 12px;
`;
