import { useMemo } from "react";
import styled from "@emotion/styled";
import Cookies from "js-cookie";
import { Accordion } from "components/Accordion";
import { COMMIT_CHART_TYPE_VIEW_OPTIONS_ACCORDION } from "constants/cookies";
import { size } from "constants/tokens";
import { useQueryParam } from "hooks/useQueryParam";
import { ChartTypes, Commits, ChartToggleQueryParams } from "types/commits";
import {
  getCommitKey,
  getCommitWidth,
  RenderCommitsChart,
} from "../RenderCommit";
import { FlexRowContainer, CommitWrapper } from "../styles";
import {
  findMaxGroupedTaskStats,
  getAllTaskStatsGroupedByColor,
} from "../utils";
import { ChartToggle } from "./ChartToggle";
import { Grid, SolidLine } from "./Grid";
import { GridLabel } from "./GridLabel";

const DEFAULT_CHART_TYPE = ChartTypes.Absolute;
const DEFAULT_OPEN_STATE = true;

interface Props {
  versions?: Commits;
  hasTaskFilter?: boolean;
}

export const CommitChart: React.FC<Props> = ({ hasTaskFilter, versions }) => {
  const [chartOpen, setChartOpen] = useQueryParam(
    ChartToggleQueryParams.chartOpen,
    DEFAULT_OPEN_STATE,
  );
  const [chartType, setChartType] = useQueryParam(
    ChartToggleQueryParams.chartType,
    DEFAULT_CHART_TYPE,
  );

  const onChangeChartType = (type: ChartTypes): void => {
    setChartType(type);
  };

  const onChangeChartOpen = (open: boolean): void => {
    setChartOpen(open);
  };

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

  return !versions ? (
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
