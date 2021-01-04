import React from "react";
import { Table } from "antd";
import { ColumnProps } from "antd/es/table";
import get from "lodash/get";
import queryString from "query-string";
import { useHistory, useLocation } from "react-router-dom";
import { TaskResult, SortDirection, PatchTasks } from "gql/generated/types";
import { PatchTasksQueryParams, TableOnChange } from "types/task";

interface Props {
  data?: PatchTasks;
  columns: Array<ColumnProps<TaskResult>>;
}

export const TasksTable: React.FC<Props> = ({ data, columns }) => {
  const { replace } = useHistory();
  const { search, pathname } = useLocation();

  const tableChangeHandler: TableOnChange<TaskResult> = (...[, , sorter]) => {
    const { order, columnKey } = Array.isArray(sorter) ? sorter[0] : sorter;

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
      dataSource={get(data, "tasks", []) as TaskResult[]}
      onChange={tableChangeHandler}
      childrenColumnName="executionTasksFull"
    />
  );
};

const arrayFormat = "comma";

const rowKey = ({ id }: { id: string }): string => id;
