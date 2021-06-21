import React, { PureComponent } from "react";
import styled from "@emotion/styled";
// import { Bar } from "./commitGraph/Bar";
import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  CartesianAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

type TaskCounts = {
  success: number;
  failure: number;
  dispatched: number;
  scheduled: number;
  unscheduled: number;
  systemFailure: number;
  setupFailure: number;
};

interface Props {
  taskCounts: TaskCounts[];
  createTime: string;
  hash: string;
  title: string;
  author: string;
}
const data = [
  {
    success: 2,
    failure: 4,
    dispatched: 6,
    scheduled: 8,
    unscheduled: 1,
    systemFailure: 0,
    setupFailure: 0,
  },
  {
    success: 2,
    failure: 4,
    dispatched: 6,
    scheduled: 8,
    unscheduled: 1,
    systemFailure: 0,
    setupFailure: 0,
  },
  {
    success: 2,
    failure: 4,
    dispatched: 6,
    scheduled: 8,
    unscheduled: 1,
    systemFailure: 0,
    setupFailure: 0,
  },
  {
    success: 2,
    failure: 4,
    dispatched: 6,
    scheduled: 8,
    unscheduled: 1,
    systemFailure: 0,
    setupFailure: 0,
  },
  {
    success: 2,
    failure: 4,
    dispatched: 6,
    scheduled: 8,
    unscheduled: 1,
    systemFailure: 1,
    setupFailure: 0,
  },
  {
    success: 2,
    failure: 4,
    dispatched: 6,
    scheduled: 8,
    unscheduled: 1,
    systemFailure: 0,
    setupFailure: 0,
  },
  {
    success: 2,
    failure: 4,
    dispatched: 6,
    scheduled: 8,
    unscheduled: 1,
    systemFailure: 0,
    setupFailure: 0,
  },
];

export const CommitGraph: React.FC<Props> = ({
  taskCounts,
  createTime,
  hash,
  title,
  author,
}) => {
  const heights = { success: taskCounts[0].success };
  return (
    <>
      <CartesianAxis
        x={4}
        width={4}
        viewBox={{ x: 10, y: 10, width: 10, height: 10 }}
      />
      <BarChart width={1220} height={250} barGap={0} data={data}>
        <CartesianGrid vertical={false} strokeDasharray="3 2" />
        <Tooltip />
        <Legend />
        <Bar dataKey="success" fill={barColors.success} />
        <Bar dataKey="failure" fill={barColors.failure} />
        <Bar dataKey="setupFailure" fill={barColors.setupFailure} />
        <Bar dataKey="dispatched" fill={barColors.dispatched} />
        <Bar dataKey="scheduled" fill={barColors.scheduled} />
        <Bar dataKey="unscheduled" fill={barColors.unscheduled} />
        <Bar dataKey="systemFailure" fill={barColors.systemFailure} />
      </BarChart>
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
  margin-right: 5vw;
`;

// const SuccessBar = styled.div`
//   color: ${barColors.success};
//   width: 10px;
// `;
