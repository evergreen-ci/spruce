import React from "react";
import { loader } from "components/Loading/Loader";
import { TaskResult } from "gql/queries/get-patch-tasks";
import { InfinityTable } from "antd-table-infinity";
import Badge from "@leafygreen-ui/badge";
import { ColumnProps } from "antd/es/table";
import { NetworkStatus } from "apollo-client";
import { StyledRouterLink } from "components/styles/StyledLink";
import { PatchTasksQueryParams, TableOnChange } from "types/task";
import { useHistory, useLocation } from "react-router-dom";
import queryString from "query-string";
import { TaskSortDir } from "gql/queries/get-patch-tasks";

interface Props {
  networkStatus: NetworkStatus;
  data?: [TaskResult];
  loading: boolean;
  fullTableLoad: boolean;
}

export const TasksTable: React.FC<Props> = ({
  networkStatus,
  data = [],
  loading,
  fullTableLoad
}) => {
  const { replace } = useHistory();
  const { search, pathname } = useLocation();

  const tableChangeHandler: TableOnChange<TaskResult> = (
    ...[, , { order, columnKey }]
  ) => {
    replace(
      `${pathname}?${queryString.stringify({
        ...queryString.parse(search),
        [PatchTasksQueryParams.SortDir]: getSortDirFromOrder(order),
        [PatchTasksQueryParams.SortBy]: columnKey
      })}`
    );
  };

  const isLoading = networkStatus < NetworkStatus.ready || loading;

  return (
    <InfinityTable
      key="key"
      loading={networkStatus < NetworkStatus.ready}
      pageSize={10000}
      loadingIndicator={loader}
      columns={columns}
      scroll={{ y: 350 }}
      dataSource={data}
      onChange={tableChangeHandler}
      rowKey={rowKey}
    />
  );
};

const orderKeyToSortParam = {
  ascend: TaskSortDir.Asc,
  descend: TaskSortDir.Desc
};
const getSortDirFromOrder = (order: "ascend" | "descend") =>
  orderKeyToSortParam[order];

const rowKey = ({ id }: { id: string }): string => id;

enum TableColumnHeader {
  Name = "NAME",
  Status = "STATUS",
  BaseStatus = "BASE_STATUS",
  Variant = "VARIANT"
}

const columns: Array<ColumnProps<TaskResult>> = [
  {
    title: "Name",
    dataIndex: "displayName",
    key: TableColumnHeader.Name,
    sorter: true,
    width: "50%",
    className: "cy-task-table-col-NAME",
    render: (name: string, { id }: TaskResult) => (
      <StyledRouterLink to={`/task/${id}`}>{name}</StyledRouterLink>
    )
  },
  {
    title: "Patch Status",
    dataIndex: "status",
    key: TableColumnHeader.Status,
    sorter: true,
    className: "cy-task-table-col-STATUS",
    render: (tag: string): JSX.Element => <Badge key={tag}>{tag}</Badge>
  },
  {
    title: "Base Status",
    dataIndex: "baseStatus",
    key: TableColumnHeader.BaseStatus,
    sorter: true,
    className: "cy-task-table-col-BASE_STATUS",
    render: (tag: string): JSX.Element => <Badge key={tag}>{tag}</Badge>
  },
  {
    title: "Variant",
    width: "25%",
    dataIndex: "buildVariant",
    key: TableColumnHeader.Variant,
    sorter: true,
    className: "cy-task-table-col-VARIANT"
  }
];
