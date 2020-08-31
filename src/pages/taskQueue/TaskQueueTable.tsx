import React, { useEffect } from "react";
import { useQuery } from "@apollo/client";
import { Body } from "@leafygreen-ui/typography";
import { Table } from "antd";
import { ColumnProps } from "antd/es/table";
import { useParams, useLocation } from "react-router-dom";
import { StyledRouterLink } from "components/styles";
import { getVersionRoute } from "constants/routes";
import {
  DistroTaskQueueQuery,
  DistroTaskQueueQueryVariables,
  TaskQueueItem,
} from "gql/generated/types";
import { DISTRO_TASK_QUEUE } from "gql/queries";
import { usePrevious } from "hooks";

export const TaskQueueTable = () => {
  const { distro } = useParams<{ distro: string }>();

  const { data: taskQueueItemsData, loading, refetch: refetchQueue } = useQuery<
    DistroTaskQueueQuery,
    DistroTaskQueueQueryVariables
  >(DISTRO_TASK_QUEUE, {
    variables: { distroId: distro },
    errorPolicy: "ignore",
  });

  const taskQueueItems = taskQueueItemsData?.distroTaskQueue ?? [];

  // REFETCH QUEUE IF URL PARAM CHANGES
  const { search } = useLocation();
  const prevSearch = usePrevious<string>(search);
  const searchChanged = search !== prevSearch;

  useEffect(() => {
    if (searchChanged && distro) {
      refetchQueue({ distroId: distro });
    }
  }, [searchChanged, refetchQueue, distro]);

  const columns: Array<ColumnProps<TaskQueueItem>> = [
    {
      title: "",
      dataIndex: "number",
      key: "number",
      className: "cy-task-queue-col-index",
      render: (...[, , index]) => <Body weight="medium">{index + 1}</Body>,
    },
    {
      title: "Task",
      dataIndex: "displayName",
      key: "displayName",
      className: "cy-task-queue-col-task",
      width: "25%",
    },
    {
      title: "Est. Runtime",
      dataIndex: "expectedDuration",
      key: "expectedDuration",
      className: "cy-task-queue-col-runtime",
      width: "25%",
    },
    {
      title: "Version",
      dataIndex: "version",
      key: "version",
      className: "cy-task-queue-col-version",
      width: "25%",
      render: (value) => (
        <StyledRouterLink to={getVersionRoute(value)}>{value}</StyledRouterLink>
      ),
    },
    {
      title: "Task Type",
      dataIndex: "requester",
      key: "requester",
      className: "cy-task-queue-col-type",
      width: "25%",
    },
  ];

  return (
    <Table
      columns={columns}
      rowKey={({ id }: { id: string }): string => id}
      pagination={false}
      dataSource={taskQueueItems}
      loading={loading}
    />
  );
};
