import React from "react";
import styled from "@emotion/styled";

type TaskCountsHTML = {
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
  taskCounts: TaskCountsHTML;
}

function absoluteToPercent(value: number, total: number) {
  return `${(value / total) * 100}%`;
}
export const CommitGraphHTML: React.FC<Props> = ({ taskCounts }) => {
  return (
    <>
      <GraphContainerHTML>
        {taskCounts.success && (
          <Bar
            height={absoluteToPercent(taskCounts.success, taskCounts.total)}
            color={barColors.success}
          />
        )}
        {taskCounts.failure && (
          <Bar
            height={absoluteToPercent(taskCounts.failure, taskCounts.total)}
            color={barColors.failure}
          />
        )}
        {taskCounts.setupFailure && (
          <Bar
            height={absoluteToPercent(
              taskCounts.setupFailure,
              taskCounts.total
            )}
            color={barColors.setupFailure}
          />
        )}
        {taskCounts.dispatched && (
          <Bar
            height={absoluteToPercent(taskCounts.dispatched, taskCounts.total)}
            color={barColors.dispatched}
          />
        )}
        {taskCounts.scheduled && (
          <Bar
            height={absoluteToPercent(taskCounts.scheduled, taskCounts.total)}
            color={barColors.scheduled}
          />
        )}
        {taskCounts.unscheduled && (
          <Bar
            height={absoluteToPercent(taskCounts.unscheduled, taskCounts.total)}
            color={barColors.unscheduled}
          />
        )}
        {taskCounts.systemFailure && (
          <Bar
            height={absoluteToPercent(
              taskCounts.systemFailure,
              taskCounts.total
            )}
            color={barColors.systemFailure}
          />
        )}
      </GraphContainerHTML>
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

const percentWidth = `${(1 / 7) * 100}%`;

const GraphContainerHTML = styled.div`
  height: 100%;
  width: ${percentWidth};
  background-color: blue;
  display: flex;
  justify-content: flex-start;
  align-items: flex-end;
`;

const Bar = styled.div`
  height: ${(props: { height?: string }): string => props.height};
  background-color: ${(props: { color?: string }): string => props.color};
  width: 13px;
`;

// Pro: 1. Can make sure it is exactly aligned to the left end
//      2. More customizable
// Con: 1. Need to build our own tooltip
//      2. Need to build our own cartesian grid (may need to do this either way)
//      3. Way to calculate height of bars kinda janky
//      4. additional field "total" from backend
