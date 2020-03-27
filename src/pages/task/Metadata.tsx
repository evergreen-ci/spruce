import React from "react";
import { SiderCard, Divider } from "components/styles";
import { H3, P2 } from "components/Typography";
import { Skeleton } from "antd";
import get from "lodash.get";

export const Metadata = ({ loading, data }) => {
  const task = get(data, "task");
  const activatedBy = get(task, "activatedBy");
  const createTime = get(task, "createTime");
  const startTime = get(task, "startTime");
  const finishTime = get(task, "finishTime");
  const timeTaken = get(task, "timeTaken");
  const baseCommitDuration = get(task, "baseCommitDuration");
  const hostId = get(task, "hostId");

  return (
    <SiderCard>
      {loading ? (
        <Skeleton active={true} title={false} paragraph={{ rows: 4 }} />
      ) : (
        <>
          <H3>Task Metadata</H3>
          <Divider />
          <P2>Submitted by: {activatedBy}</P2>
          <P2>Submitted at: {createTime}</P2>
          <P2>Started: {startTime}</P2>
          <P2>Finished: {finishTime}</P2>
          <P2>Duration: {timeTaken} </P2>
          <P2>Base commit duration: {baseCommitDuration}</P2>
          <P2>Host: {hostId}</P2>
          <div />
        </>
      )}
      <H3>Depends On</H3>
      <Divider />
    </SiderCard>
  );
};
