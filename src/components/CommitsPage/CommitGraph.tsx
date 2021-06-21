import React from "react";
import styled from "@emotion/styled";
import { BarChart, Bar, ResponsiveContainer } from "recharts";

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
  taskCounts: TaskCounts[];
}

export const CommitGraph: React.FC<Props> = ({ taskCounts }) => {
  const width = (Object.keys(taskCounts[0]).length / 7) * 100;
  const data = taskCounts[0];
  return (
    <>
      <RowContainer>
        <ResponsiveContainer width={width} height={180}>
          <BarChart
            barSize={12}
            barGap={0}
            data={taskCounts}
            margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
          >
            {data.success && <Bar dataKey="success" fill={barColors.success} />}
            {data.failure && <Bar dataKey="failure" fill={barColors.failure} />}
            {data.setupFailure && (
              <Bar dataKey="setupFailure" fill={barColors.setupFailure} />
            )}
            {data.dispatched && (
              <Bar dataKey="dispatched" fill={barColors.dispatched} />
            )}
            {data.scheduled && (
              <Bar dataKey="scheduled" fill={barColors.scheduled} />
            )}
            {data.unscheduled && (
              <Bar dataKey="unscheduled" fill={barColors.unscheduled} />
            )}
            {data.systemFailure && (
              <Bar dataKey="systemFailure" fill={barColors.systemFailure} />
            )}
          </BarChart>
        </ResponsiveContainer>
      </RowContainer>
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

const RowContainer = styled.div`
  margin-left: 0.5%;
  width: 100%;
`;
