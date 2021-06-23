import React from "react";
import styled from "@emotion/styled";
import { uiColors } from "@leafygreen-ui/palette";
const { green, gray, yellow, red } = uiColors;

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
  } = taskCounts || {};
  return (
    <>
      <GraphContainer>
        {success && (
          <Bar
            height={calculateHeight(success, max, total, graphType)}
            color={green.base}
          />
        )}
        {failure && (
          <Bar
            height={calculateHeight(failure, max, total, graphType)}
            color={red.base}
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
            color={yellow.base}
          />
        )}
        {scheduled && (
          <Bar
            height={calculateHeight(scheduled, max, total, graphType)}
            color={gray.dark1}
          />
        )}
        {unscheduled && (
          <Bar
            height={calculateHeight(unscheduled, max, total, graphType)}
            color={gray.light1}
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
