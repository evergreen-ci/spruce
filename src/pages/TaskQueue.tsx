import React from "react";
import { Table } from "antd";
import { ColumnProps } from "antd/es/table";
import { useQuery } from "@apollo/react-hooks";
import {
  DistroTaskQueueQuery,
  DistroTaskQueueQueryVariables,
  TaskQueueItem,
} from "gql/generated/types";
import { DISTRO_TASK_QUEUE } from "gql/queries";
import { TableContainer, PageWrapper } from "components/styles";

export const TaskQueue = () => {
  const { data: taskQueueItemsData, loading } = useQuery<
    DistroTaskQueueQuery,
    DistroTaskQueueQueryVariables
  >(DISTRO_TASK_QUEUE, { variables: { distroId: "rhel71-power8-small" } });

  const taskQueueItems = taskQueueItemsData?.distroTaskQueue ?? [];

  const columns: Array<ColumnProps<TaskQueueItem>> = [
    {
      title: "",
      dataIndex: "number",
      key: "number",
      className: "cy-hosts-table-col-ID",
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
    <PageWrapper>
      <TableContainer hide={false}>
        <Table
          columns={columns}
          rowKey={({ id }: { id: string }): string => id}
          pagination={false}
          dataSource={taskQueueItems}
          loading={loading}
        />
      </TableContainer>
    </PageWrapper>
  );
};
