import React from "react";
import { TaskStatusBadge } from "components/TaskStatusBadge";
import { TaskResult, SortDirection, PatchTasks } from "gql/generated/types";
import { NetworkStatus } from "apollo-client";
import { StyledRouterLink } from "components/styles/StyledLink";
import { PatchTasksQueryParams, TableOnChange } from "types/task";
import { useHistory, useLocation } from "react-router-dom";
import queryString from "query-string";
import Table, { ColumnProps } from "antd/es/table";
import get from "lodash/get";

interface Props {
  networkStatus: NetworkStatus;
  data?: PatchTasks;
}

export const TasksTable: React.FC<Props> = ({ data }) => {
  const { replace } = useHistory();
  const { search, pathname } = useLocation();

  const tableChangeHandler: TableOnChange<TaskResult> = (
    ...[, , { order, columnKey }]
  ) => {
    const nextQueryParams = queryString.stringify(
      {
        ...queryString.parse(search, { arrayFormat }),
        [PatchTasksQueryParams.SortDir]:
          order === "ascend" ? SortDirection.Asc : SortDirection.Desc,
        [PatchTasksQueryParams.SortBy]: columnKey,
        [PatchTasksQueryParams.Page]: "0",
      },
      { arrayFormat }
    );
    if (nextQueryParams !== search.split("?")[1]) {
      replace(`${pathname}?${nextQueryParams}`);
    }
  };

  return (
    <Table
      rowKey={rowKey}
      pagination={false}
      columns={columns}
      dataSource={get(data, "tasks", [])}
      onChange={tableChangeHandler}
    />
  );
};

const arrayFormat = "comma";

const rowKey = ({ id }: { id: string }): string => id;

enum TableColumnHeader {
  Name = "NAME",
  Status = "STATUS",
  BaseStatus = "BASE_STATUS",
  Variant = "VARIANT",
}

const renderStatusBadge = (status): null | JSX.Element => {
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
    render: (name: string, { id }: TaskResult): JSX.Element => (
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
