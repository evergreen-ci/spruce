import styled from "@emotion/styled";
import { ChartTypes } from "types/commits";
import { commitChartHeight } from "../constants";
import { CommitChartTooltip } from "./CommitChartTooltip";
import { ColorCount, calculateBarHeight } from "./utils";

interface Props {
  groupedTaskStats: ColorCount[];
  max: number;
  total: number;
  chartType: ChartTypes;
}

export const CommitChart: React.FC<Props> = ({
  max,
  chartType,
  groupedTaskStats,
  total,
}) => (
  <CommitChartTooltip
    groupedTaskStats={groupedTaskStats}
    trigger={
      <ChartContainer data-cy="commit-chart-container">
        {groupedTaskStats.map(({ color, count }) => (
          <Bar
            data-cy="commit-chart-bar"
            key={color}
            height={calculateBarHeight(count, max, total, chartType)}
            color={color}
          />
        ))}
      </ChartContainer>
    }
  />
);

const ChartContainer = styled.div`
  height: ${commitChartHeight}px;
  display: flex;
  justify-content: flex-start;
  align-items: flex-end;
`;

interface BarProps {
  height: string;
  color: string;
}

const Bar = styled.div<BarProps>`
  height: ${({ height }) => height};
  background-color: ${({ color }) => color};
  width: 13px;
  cursor: pointer;
`;
