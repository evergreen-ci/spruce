import React from "react";
import styled from "@emotion/styled";

type TaskCounts = {
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
  taskCounts: TaskCounts;
  max?: number;
  graphType: "percentage" | "absolute";
}

function calculateHeight(
  value: number,
  max: number,
  total: number,
  graphType: "percentage" | "absolute"
) {
  if (graphType === "percentage") {
    return `${(value / total) * 100}%`;
  }
  return `${(value / max) * 100}%`;
}
export const CommitGraph: React.FC<Props> = ({
  taskCounts,
  max,
  graphType,
}) => {
  const {
    success,
    failure,
    dispatched,
    scheduled,
    unscheduled,
    systemFailure,
    setupFailure,
    total,
  } = taskCounts;
  return (
    <>
      <GraphContainer>
        {success && (
          <Bar
            height={calculateHeight(success, max, total, graphType)}
            color={barColors.success}
          />
        )}
        {failure && (
          <Bar
            height={calculateHeight(failure, max, total, graphType)}
            color={barColors.failure}
          />
        )}
        {setupFailure && (
          <Bar
            height={calculateHeight(setupFailure, max, total, graphType)}
            color={barColors.setupFailure}
          />
        )}
        {dispatched && (
          <Bar
            height={calculateHeight(dispatched, max, total, graphType)}
            color={barColors.dispatched}
          />
        )}
        {scheduled && (
          <Bar
            height={calculateHeight(scheduled, max, total, graphType)}
            color={barColors.scheduled}
          />
        )}
        {unscheduled && (
          <Bar
            height={calculateHeight(unscheduled, max, total, graphType)}
            color={barColors.unscheduled}
          />
        )}
        {systemFailure && (
          <Bar
            height={calculateHeight(systemFailure, max, total, graphType)}
            color={barColors.systemFailure}
          />
        )}
      </GraphContainer>
    </>
  );
};

const barColors = {
  success: "#13AA52",
  failure: "#CF4A22",
  dispatched: "#FFDD49",
  scheduled: "#5D6C74",
  unscheduled: "#B8C4C2",
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
