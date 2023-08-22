import styled from "@emotion/styled";
import { commitChartHeight } from "pages/commits/constants";
import { ColorCount } from "pages/commits/types";
import { ChartTypes } from "types/commits";
import { calculateBarHeight } from "../utils";
import { CommitChartTooltip } from "./CommitChartTooltip";

interface Props {
  groupedTaskStats: ColorCount[];
  max: number;
  total: number;
  chartType: ChartTypes;
  eta?: Date;
}

export const CommitBarChart: React.FC<Props> = ({
  chartType,
  eta,
  groupedTaskStats,
  max,
  total,
}) => (
  <CommitChartTooltip
    groupedTaskStats={groupedTaskStats}
    eta={eta}
    trigger={
      <ChartContainer data-cy="commit-chart-container" data-type={chartType}>
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
  width: 12px;
`;
