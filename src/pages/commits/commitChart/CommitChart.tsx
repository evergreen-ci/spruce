import React from "react";
import styled from "@emotion/styled";
import { mapTaskStatusToColor } from "constants/task";
import { TaskStatus } from "types/task";

export type TaskStats = {
  Succeeded?: number;
  Failed?: number;
  Dispatched?: number;
  WillRun?: number;
  Unscheduled?: number;
  SystemFailed?: number;
  SetupFailed?: number;
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
          color={mapTaskStatusToColor[TaskStatus[status]]}
        />
      ))}
    </ChartContainer>
  );
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
