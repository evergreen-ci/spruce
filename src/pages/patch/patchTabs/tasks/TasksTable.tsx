import React from "react";
import { TaskResult, SortDirection, PatchTasks } from "gql/generated/types";
import { PatchTasksQueryParams, TableOnChange } from "types/task";
import { useHistory, useLocation } from "react-router-dom";
import queryString from "query-string";
import { ColumnProps } from "antd/es/table";
import { Table } from "antd";
import get from "lodash/get";

interface Props {
  data?: PatchTasks;
  columns: Array<ColumnProps<TaskResult>>;
}

export const TasksTable: React.FC<Props> = ({ data, columns }) => {
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
      data-test-id="tasks-table"
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
