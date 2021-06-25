import React from "react";
import styled from "@emotion/styled";
import { uiColors } from "@leafygreen-ui/palette";

const { green, gray, yellow, red } = uiColors;

<<<<<<< HEAD:src/components/CommitsPage/CommitGraph.tsx
type TaskCounts = {
=======
export type TaskStats = {
>>>>>>> changed taskCounts to taskStats, changed wrapper file name:src/pages/commits/commitGraph/CommitGraph.tsx
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
  graphType: "percentage" | "absolute";
}

function calculateHeight(
  value: number,
  max: number,
  total: number,
  graphType: string
) {
  if (graphType === "percentage") {
    return `${(value / total) * 100}%`;
  }
  return `${(value / max) * 100}%`;
}
export const CommitGraph: React.FC<Props> = ({ taskStats, max, graphType }) => {
  const { total } = taskStats || {};
  return (
    <>
      <GraphContainer>
        {Object.keys(taskStats).map((status) => (
          <Bar
            height={calculateHeight(taskStats[status], max, total, graphType)}
            color={barColors[status]}
          />
        ))}
      </GraphContainer>
    </>
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

const GraphContainer = styled.div`
  height: 100%;
  width: ${(1 / 7) * 100}%;
  display: flex;
  margin-left: 9px;
  justify-content: flex-start;
  align-items: flex-end;
`;

const Bar = styled.div`
  height: ${(props: { height?: string }): string => props.height};
  background-color: ${(props: { color?: string }): string => props.color};
  width: 13px;
`;
