import React from "react";
import styled from "@emotion/styled";
import { ChartTypes } from "types/commits";
import { ColorCount } from "./utils";

interface Props {
  groupedTaskStats: ColorCount[];
  max: number;
  total: number;
  chartType: ChartTypes;
}

function calculateHeight(
  value: number,
  max: number,
  total: number,
  chartType: string
) {
  if (chartType === ChartTypes.Percentage) {
    return `${(value / total) * 100}%`;
  }
  return `${(value / max) * 100}%`;
}

export const CommitChart: React.FC<Props> = ({
  max,
  chartType,
  groupedTaskStats,
  total,
}) => (
  <ChartContainer>
    {groupedTaskStats.map(({ color, count }) => (
      <Bar
        key={color}
        height={calculateHeight(count, max, total, chartType)}
        color={color}
      />
    ))}
  </ChartContainer>
);

const ChartContainer = styled.div`
  height: 224px;
  width: 100%;
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
`;
