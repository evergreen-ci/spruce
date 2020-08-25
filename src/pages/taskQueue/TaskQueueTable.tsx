import React, { useEffect } from "react";
import { Table } from "antd";
import { ColumnProps } from "antd/es/table";
import { useQuery } from "@apollo/react-hooks";
import {
  DistroTaskQueueQuery,
  DistroTaskQueueQueryVariables,
  TaskQueueItem,
} from "gql/generated/types";
import { DISTRO_TASK_QUEUE } from "gql/queries";
import { Body } from "@leafygreen-ui/typography";
import { useParams, useLocation } from "react-router-dom";
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
      className: "cy-hosts-table-col-index",
      render: (...[, , index]) => <Body weight="medium">{index + 1}</Body>,
    },
    {
      title: "Task",
      dataIndex: "displayName",
      key: "displayName",
      className: "cy-hosts-table-col-ID",
      width: "25%",
    },
    {
      title: "Est. Runtime",
      dataIndex: "expectedDuration",
      key: "expectedDuration",
      className: "cy-hosts-table-col-ID",
      width: "25%",
    },
    {
      title: "Revision",
      dataIndex: "revision",
      key: "revision",
      className: "cy-hosts-table-col-ID",
      width: "25%",
      render: (value) => value.slice(0, 7),
    },
    {
      title: "Task Type",
      dataIndex: "requester",
      key: "requester",
      className: "cy-hosts-table-col-ID",
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
