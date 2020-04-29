import React from "react";
import { loader } from "components/Loading/Loader";
import { TaskStatusBadge } from "components/TaskStatusBadge";
import { TaskResult } from "gql/generated/types";
import { InfinityTable } from "antd-table-infinity";
import { ColumnProps } from "antd/es/table";
import { NetworkStatus } from "apollo-client";
import { StyledRouterLink } from "components/styles/StyledLink";
import { PatchTasksQueryParams, TableOnChange } from "types/task";
import { useHistory, useLocation } from "react-router-dom";
import queryString from "query-string";
import { SortDirection, PatchTasks } from "gql/generated/types";
import get from "lodash.get";

interface Props {
  networkStatus: NetworkStatus;
  data?: PatchTasks;
  onFetch: () => void;
}

export const TasksTable: React.FC<Props> = ({
  networkStatus,
  data,
  onFetch,
}) => {
  const { replace } = useHistory();
  const { search, pathname } = useLocation();

  const tableChangeHandler: TableOnChange<TaskResult> = (
    ...[, , { order, columnKey }]
  ) => {
    replace(
      `${pathname}?${queryString.stringify(
        {
          ...queryString.parse(search, { arrayFormat }),
          [PatchTasksQueryParams.SortDir]: getSortDirFromOrder(order),
          [PatchTasksQueryParams.SortBy]: columnKey,
        },
        { arrayFormat }
      )}`
    );
  };
  return (
    <InfinityTable
      key="key"
      loading={networkStatus < NetworkStatus.ready}
      pageSize={10000}
      loadingIndicator={loader}
      columns={columns}
      scroll={{ y: 350 }}
      dataSource={get(data, "tasks", [])}
      onChange={tableChangeHandler}
      onFetch={onFetch}
      rowKey={rowKey}
    />
  );
};

const arrayFormat = "comma";

const orderKeyToSortParam = {
  ascend: SortDirection.Asc,
  descend: SortDirection.Desc,
};
const getSortDirFromOrder = (order: "ascend" | "descend") =>
  orderKeyToSortParam[order];

const rowKey = ({ id }: { id: string }): string => id;

enum TableColumnHeader {
  Name = "NAME",
  Status = "STATUS",
  BaseStatus = "BASE_STATUS",
  Variant = "VARIANT",
}

const renderStatusBadge = (status) => {
  if (status === "" || !status) {
    return null;
  }
  return <TaskStatusBadge status={status} />;
};
const columns: Array<ColumnProps<TaskResult>> = [
  {
    title: "Name",
    dataIndex: "displayName",
    key: TableColumnHeader.Name,
    sorter: true,
    width: "40%",
    className: "cy-task-table-col-NAME",
    render: (name: string, { id }: TaskResult) => (
      <StyledRouterLink to={`/task/${id}`}>{name}</StyledRouterLink>
    ),
  },
  {
    title: "Patch Status",
    dataIndex: "status",
    key: TableColumnHeader.Status,
    sorter: true,
    className: "cy-task-table-col-STATUS",
    render: renderStatusBadge,
  },
  {
    title: "Base Status",
    dataIndex: "baseStatus",
    key: TableColumnHeader.BaseStatus,
    sorter: true,
    className: "cy-task-table-col-BASE_STATUS",
    render: renderStatusBadge,
  },
  {
    title: "Variant",
    dataIndex: "buildVariant",
    key: TableColumnHeader.Variant,
    sorter: true,
    className: "cy-task-table-col-VARIANT",
  },
];
