import React from "react";
import { loader } from "components/Loading/Loader";
import { TaskResult } from "gql/queries/get-patch-tasks";
import { InfinityTable } from "antd-table-infinity";
import Badge, { Variant } from "@leafygreen-ui/badge";
import { ColumnProps } from "antd/es/table";
import { NetworkStatus } from "apollo-client";
import { StyledRouterLink } from "components/styles/StyledLink";
import { PatchTasksQueryParams, TableOnChange } from "types/task";
import { useHistory, useLocation } from "react-router-dom";
import queryString from "query-string";
import { TaskSortDir } from "gql/queries/get-patch-tasks";
import { TaskStatus } from "types/task";
import styled from "@emotion/styled/macro";

interface Props {
  networkStatus: NetworkStatus;
  data?: [TaskResult];
  onFetch: () => void;
}

export const TasksTable: React.FC<Props> = ({
  networkStatus,
  data = [],
  onFetch
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
      onFetch={onFetch}
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

const mapTaskStatusToBadgeVariant = {
  [TaskStatus.Inactive]: Variant.LightGray,
  [TaskStatus.Unstarted]: Variant.LightGray,
  [TaskStatus.Undispatched]: Variant.LightGray,
  [TaskStatus.Started]: Variant.Yellow,
  [TaskStatus.Dispatched]: Variant.LightGray,
  [TaskStatus.Succeeded]: Variant.Green,
  [TaskStatus.Failed]: Variant.Red,
  [TaskStatus.StatusBlocked]: Variant.DarkGray,
  [TaskStatus.StatusPending]: Variant.Yellow
};

const failureColors = {
  text: "#800080",
  border: "#CC99CC",
  fill: "#E6CCE6"
};

const mapUnsupportedBadgeColors = {
  [TaskStatus.SystemFailed]: failureColors,
  [TaskStatus.TestTimedOut]: failureColors,
  [TaskStatus.SetupFailed]: {
    border: "#E7DBEC",
    fill: "#F3EDF5",
    text: "#877290"
  }
};

interface BadgeColorProps {
  border: string;
  fill: string;
  text: string;
}

// only use for statuses whose color is not supported by leafygreen badge variants, i.e. SystemFailed, TestTimedOut, SetupFailed
const StyledBadge = styled(Badge)`
  border-color: ${(props: BadgeColorProps) => props.border} !important;
  background-color: ${(props: BadgeColorProps) => props.fill} !important;
  color: ${(props: BadgeColorProps) => props.text} !important;
`;

const renderStatusBadge = (status: string) => {
  if (status in mapTaskStatusToBadgeVariant) {
    return (
      <Badge key={status} variant={mapTaskStatusToBadgeVariant[status]}>
        {status}
      </Badge>
    );
  }
  return (
    <StyledBadge key={status} {...mapUnsupportedBadgeColors[status]}>
      {status}
    </StyledBadge>
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
    width: "40%",
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
    render: renderStatusBadge
  },
  {
    title: "Base Status",
    dataIndex: "baseStatus",
    key: TableColumnHeader.BaseStatus,
    sorter: true,
    className: "cy-task-table-col-BASE_STATUS",
    render: renderStatusBadge
  },
  {
    title: "Variant",
    dataIndex: "buildVariant",
    key: TableColumnHeader.Variant,
    sorter: true,
    className: "cy-task-table-col-VARIANT"
  }
];
