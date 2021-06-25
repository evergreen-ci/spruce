import React from "react";
import styled from "@emotion/styled";
import { uiColors } from "@leafygreen-ui/palette";

const { green, gray, yellow, red } = uiColors;

export type TaskStats = {
  success?: number;
  failure?: number;
  dispatched?: number;
  scheduled?: number;
  unscheduled?: number;
  systemFailure?: number;
  setupFailure?: number;
  total: number;
};

interface Props {
  taskStats: TaskStats;
  max: number;
  chartType: "percentage" | "absolute";
}

function calculateHeight(
  value: number,
  max: number,
  total: number,
  chartType: string
) {
  if (chartType === "percentage") {
    return `${(value / total) * 100}%`;
  }
  return `${(value / max) * 100}%`;
}
export const CommitChart: React.FC<Props> = ({ taskStats, max, chartType }) => {
  const { total } = taskStats || {};
  return (
    <ChartContainer>
      {Object.keys(taskStats).map((status) => (
        <Bar
          height={calculateHeight(taskStats[status], max, total, chartType)}
          color={barColors[status]}
        />
      ))}
    </ChartContainer>
  );
};

const barColors = {
  success: green.base,
  failure: red.base,
  dispatched: yellow.base,
  scheduled: gray.dark1,
  unscheduled: gray.light1,
  systemFailure: "#633F70",
  setupFailure: "#A075AF",
};

const ChartContainer = styled.div`
  height: 100%;
  width: ${(1 / 7) * 100}%;
  display: flex;
  margin-left: 9px;
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
