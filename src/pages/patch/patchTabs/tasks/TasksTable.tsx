import React from "react";

import { loader } from "components/Loading/Loader";
import { TaskResult } from "gql/queries/get-patch-tasks";
import { InfinityTable } from "antd-table-infinity";
import Badge, { Variant } from "@leafygreen-ui/badge";
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

interface Props {
  networkStatus: NetworkStatus;
  data: [TaskResult];
}

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
    render: (name: string, { id }: TaskResult) => {
      return <StyledRouterLink to={`/task/${id}`}>{name}</StyledRouterLink>;
    }
  },
  {
    title: "Patch Status",
    dataIndex: "status",
    key: TableColumnHeader.Status,
    sorter: true,
    render: (tag: string): JSX.Element => {
      return (
        <span>
          <Badge key={tag}>{tag}</Badge>
        </span>
      );
    }
  },
  {
    title: "Base Status",
    dataIndex: "baseStatus",
    key: TableColumnHeader.BaseStatus,
    sorter: true,
    render: (tag: string): JSX.Element => {
      return (
        <span>
          <Badge key={tag}>{tag}</Badge>
        </span>
      );
    }
  },
  {
    title: "Variant",
    width: "25%",
    dataIndex: "buildVariant",
    key: TableColumnHeader.Variant,
    sorter: true
  }
];

const rowKey = ({ id }: { id: string }): string => id;

const orderKeyToSortParamMap = {
  ascend: SortQueryParam.Asc,
  descend: SortQueryParam.Desc
};
const getSortDirFromOrder = (order: "ascend" | "descend") =>
  orderKeyToSortParamMap[order];

export const TasksTable: React.FC<Props> = ({ networkStatus, data }) => {
  const { replace } = useHistory();
  const { search, pathname } = useLocation();

  const tableChangeHandler: TableOnChange<TaskResult> = (
    ...[, , { order, columnKey }]
  ) => {
    const parsedSearch = queryString.parse(search);
    parsedSearch[PatchTasksQueryParams.SortDir] = getSortDirFromOrder(order);
    parsedSearch[PatchTasksQueryParams.SortBy] = columnKey;

    replace(`${pathname}?${queryString.stringify(parsedSearch)}`);
  };

  return (
    <>
      <InfinityTable
        key="key"
        loading={networkStatus < NetworkStatus.ready}
        // onFetch={onFetch}
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
