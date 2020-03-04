import React from "react";
import { loader } from "components/Loading/Loader";
import { TaskResult } from "gql/queries/get-patch-tasks";
import { InfinityTable } from "antd-table-infinity";
import Badge from "@leafygreen-ui/badge";
import { ColumnProps } from "antd/es/table";
import { NetworkStatus } from "apollo-client";
import { StyledRouterLink } from "components/styles/StyledLink";
import {
  SortQueryParam,
  PatchTasksQueryParams,
  TableOnChange
} from "pages/types/task";
import { useHistory, useLocation } from "react-router-dom";
import queryString from "query-string";
import { rowKey } from "pages/task/TestsTableCore";

interface Props {
  networkStatus: NetworkStatus;
  data: [TaskResult];
}

const orderKeyToSortParam = {
  ascend: SortQueryParam.Asc,
  descend: SortQueryParam.Desc
};
const getSortDirFromOrder = (order: "ascend" | "descend") =>
  orderKeyToSortParam[order];

export const TasksTable: React.FC<Props> = ({ networkStatus, data }) => {
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

  return (
    <>
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
    </>
  );
};

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
    className: "cy-task-table-col-name",
    render: (name: string, { id }: TaskResult) => (
      <StyledRouterLink to={`/task/${id}`}>{name}</StyledRouterLink>
    )
  },
  {
    title: "Patch Status",
    dataIndex: "status",
    key: TableColumnHeader.Status,
    sorter: true,
    className: "cy-task-table-col-status",
    render: (tag: string): JSX.Element => <Badge key={tag}>{tag}</Badge>
  },
  {
    title: "Base Status",
    dataIndex: "baseStatus",
    key: TableColumnHeader.BaseStatus,
    sorter: true,
    className: "cy-task-table-col-base-status",
    render: (tag: string): JSX.Element => <Badge key={tag}>{tag}</Badge>
  },
  {
    title: "Variant",
    width: "25%",
    dataIndex: "buildVariant",
    key: TableColumnHeader.Variant,
    sorter: true,
    className: "cy-task-table-col-variant"
  }
];
