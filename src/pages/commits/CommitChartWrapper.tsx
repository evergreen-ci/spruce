import { useMemo } from "react";
import styled from "@emotion/styled";
import { useLocation } from "react-router-dom";
import { Accordion } from "components/Accordion";
import { size } from "constants/tokens";
import { useUpdateURLQueryParams } from "hooks";
import { ChartTypes, Commits, ChartToggleQueryParams } from "types/commits";
import { queryString } from "utils";
import { ChartToggle } from "./ActiveCommits/ChartToggle";
import { Grid, SolidLine } from "./ActiveCommits/Grid";
import { GridLabel } from "./ActiveCommits/GridLabel";
import {
  getAllTaskStatsGroupedByColor,
  findMaxGroupedTaskStats,
} from "./ActiveCommits/utils";
import {
  getCommitKey,
  getCommitWidth,
  RenderCommitsChart,
} from "./RenderCommit";
import { FlexRowContainer, CommitWrapper } from "./styles";

const { parseQueryString, getString } = queryString;

const DEFAULT_CHART_TYPE = ChartTypes.Absolute;
const DEFAULT_OPEN_STATE = "True";

interface Props {
  versions?: Commits;
  hasTaskFilter?: boolean;
  hasError?: boolean;
}

export const CommitChartWrapper: React.FC<Props> = ({
  versions,
  hasTaskFilter,
  hasError = false,
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

  const onChangeChartOpen = (open: boolean): void => {
    const chartOpen = open ? "True" : "False";
    updateQueryParams({
      [ChartToggleQueryParams.chartOpen]: chartOpen,
    });
  };

  const chartOpen =
    ((getString(parsed[ChartToggleQueryParams.chartOpen]) as ChartTypes) ||
      DEFAULT_OPEN_STATE) === "True";

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

  return hasError ? (
    <ChartWrapper>
      <Grid numDashedLine={5} />
    </ChartWrapper>
  ) : (
    <>
      <Accordion
        title="Project Health"
        defaultOpen={chartOpen}
        onToggle={() => onChangeChartOpen(!chartOpen)}
        contents={
          <ChartWrapper>
            <FlexRowContainer>
              {versions.map((commit) => (
                <CommitWrapper
                  key={getCommitKey(commit)}
                  width={getCommitWidth(commit)}
                >
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
        }
      />
      {!chartOpen && <PaddedLine />}
    </>
  );
};

const AbsoluteContainer = styled.div`
  position: absolute;
  top: -${size.l};
  right: 0;
  left: auto;
`;

const ChartWrapper = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
  margin-top: ${size.s};
`;

const PaddedLine = styled(SolidLine)`
  margin: ${size.s} 0 ${size.xs} 0;
`;
