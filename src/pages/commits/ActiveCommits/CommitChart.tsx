import React from "react";
import styled from "@emotion/styled";
import { ChartTypes } from "types/commits";

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
