import React from "react";
import styled from "@emotion/styled";

export type GroupedTaskStats = {
  [key: string]: {
    count: number;
    statuses: string[];
  };
};
interface Props {
  groupedTaskStats: GroupedTaskStats;
  max: number;
  total: number;
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

export const CommitChart: React.FC<Props> = ({
  max,
  chartType,
  groupedTaskStats,
  total,
}) => (
  <ChartContainer>
    {Object.keys(groupedTaskStats).map((statusColor) =>
      groupedTaskStats[statusColor].count ? (
        <Bar
          key={statusColor}
          height={calculateHeight(
            groupedTaskStats[statusColor].count,
            max,
            total,
            chartType
          )}
          color={statusColor}
        />
      ) : null
    )}
  </ChartContainer>
);

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
