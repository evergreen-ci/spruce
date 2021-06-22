import React from "react";
import styled from "@emotion/styled";
import {
  BarChart,
  Bar,
  ResponsiveContainer,
  // Tooltip,
  // CartesianAxis,
  // CartesianGrid,
} from "recharts";

type TaskCounts = {
  success?: number;
  failure?: number;
  dispatched?: number;
  scheduled?: number;
  unscheduled?: number;
  systemFailure?: number;
  setupFailure?: number;
};
interface Props {
  taskCounts: TaskCounts;
}

export const CommitGraph: React.FC<Props> = ({ taskCounts }) => {
  return (
    <>
      <GraphContainer>
        <ResponsiveContainer width={Object.keys(taskCounts).length * 13}>
          <BarChart
            barSize={13}
            barGap={0}
            data={[taskCounts]}
            margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
          >
            {/* <CartesianAxis
              width={4}
              height={4}
              viewBox={{ x: 100, y: 100, width: 100, height: 100 }}
            /> */}
            {/* <CartesianGrid /> */}
            {/* <Tooltip /> */}

            {taskCounts.success && (
              <Bar dataKey="success" fill={barColors.success} />
            )}
            {taskCounts.failure && (
              <Bar dataKey="failure" fill={barColors.failure} />
            )}
            {taskCounts.setupFailure && (
              <Bar dataKey="setupFailure" fill={barColors.setupFailure} />
            )}
            {taskCounts.dispatched && (
              <Bar dataKey="dispatched" fill={barColors.dispatched} />
            )}
            {taskCounts.scheduled && (
              <Bar dataKey="scheduled" fill={barColors.scheduled} />
            )}
            {taskCounts.unscheduled && (
              <Bar dataKey="unscheduled" fill={barColors.unscheduled} />
            )}
            {taskCounts.systemFailure && (
              <Bar dataKey="systemFailure" fill={barColors.systemFailure} />
            )}
          </BarChart>
        </ResponsiveContainer>
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

const percentWidth = `${(1 / 7) * 100}%`;
const GraphContainer = styled.div`
  height: 95%;
  width: ${percentWidth};
  display: flex;
  justify-content: flex-start;
  align-items: flex-end;
`;

// Pro: 1. extra tooltop
//      2. extra cartesian grid (but not sure if too dark),
//         best if we get cartesianAxis working
// Con: 1. Bars are always in the center of the chart, need to calculate exact width
//      of the graph container based on how many bars it has
//      2. Tooltip may not be completely customizable
