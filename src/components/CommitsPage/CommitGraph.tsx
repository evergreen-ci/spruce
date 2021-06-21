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
  Tooltip,
  Legend,
  ResponsiveContainer,
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
  taskCounts: TaskCounts[];
  createTime: string;
  hash: string;
  title: string;
  author: string;
}
const CustomTooltip = ({ success, failure }) => {
  // if (active && payload && payload.length) {
  //   return (
  //     <div className="custom-tooltip">
  //       <p className="label">{`${label} : ${payload[0].value}`}</p>
  //       <p className="desc">Anything you want can be displayed here.</p>
  //     </div>
  //   );
  // }
  return <p>Hello</p>;
};

export const CommitGraph: React.FC<Props> = ({
  taskCounts,
  createTime,
  hash,
  title,
  author,
}) => {
  const width = (Object.keys(taskCounts[0]).length / 7) * 100;
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
            <Tooltip content={<CustomTooltip success={1} failure={2} />} />
            {taskCounts[0].success && (
              <Bar dataKey="success" fill={barColors.success} />
            )}
            {taskCounts[0].failure && (
              <Bar dataKey="failure" fill={barColors.failure} />
            )}
            {taskCounts[0].setupFailure && (
              <Bar dataKey="setupFailure" fill={barColors.setupFailure} />
            )}
            {taskCounts[0].dispatched && (
              <Bar dataKey="dispatched" fill={barColors.dispatched} />
            )}
            {taskCounts[0].scheduled && (
              <Bar dataKey="scheduled" fill={barColors.scheduled} />
            )}
            {taskCounts[0].unscheduled && (
              <Bar dataKey="unscheduled" fill={barColors.unscheduled} />
            )}
            {taskCounts[0].systemFailure && (
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
