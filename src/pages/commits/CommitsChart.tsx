import { useMemo } from "react";
import styled from "@emotion/styled";
import Cookies from "js-cookie";
import { useLocation } from "react-router-dom";
import { Accordion } from "components/Accordion";
import { COMMIT_CHART_TYPE_VIEW_OPTIONS_ACCORDION } from "constants/cookies";
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
const DEFAULT_OPEN_STATE = true;

interface Props {
  versions?: Commits;
  hasTaskFilter?: boolean;
  hasError?: boolean;
}

export const CommitsChart: React.VFC<Props> = ({
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
    updateQueryParams({
      [ChartToggleQueryParams.chartOpen]: open.toString(),
    });
  };

  const chartOpen = parsed[ChartToggleQueryParams.chartOpen]
    ? parsed[ChartToggleQueryParams.chartOpen] === "true"
    : DEFAULT_OPEN_STATE;

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
  const defaultOpenAccordion =
    Cookies.get(COMMIT_CHART_TYPE_VIEW_OPTIONS_ACCORDION) === "true" ||
    Cookies.get(COMMIT_CHART_TYPE_VIEW_OPTIONS_ACCORDION) === undefined;
  const onToggleAccordion = ({ isVisible }) =>
    Cookies.set(COMMIT_CHART_TYPE_VIEW_OPTIONS_ACCORDION, isVisible.toString());

  return hasError ? (
    <ChartWrapper>
      <Grid numDashedLine={5} />
    </ChartWrapper>
  ) : (
    <>
      <Accordion
        title="Project Health"
        useIndent={false}
        defaultOpen={chartOpen}
        onToggle={() => onChangeChartOpen(!chartOpen)}
      >
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
              defaultOpenAccordion={defaultOpenAccordion}
              onToggleAccordion={onToggleAccordion}
            />
          </AbsoluteContainer>
        </ChartWrapper>
      </Accordion>
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
