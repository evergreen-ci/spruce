import React from "react";
import IconButton from "@leafygreen-ui/icon-button";
import { Table } from "antd";
import { ColumnProps } from "antd/es/table";
import get from "lodash/get";
import queryString from "query-string";
import { useHistory, useLocation } from "react-router-dom";
import Icon from "components/icons/Icon";
import { TaskResult, SortDirection, PatchTasks } from "gql/generated/types";
import { PatchTasksQueryParams, TableOnChange } from "types/task";

interface Props {
  data?: PatchTasks;
  columns: Array<ColumnProps<TaskResult>>;
}

type Tasks = PatchTasks["tasks"];
type TableData = Tasks & {
  children?: Tasks[0]["executionTasksFull"];
};

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

  const transformData = (tasks: Tasks) =>
    tasks.map((task) => {
      const t = { ...task, children: undefined };
      t.children = t.executionTasksFull;
      return t;
    });
  return (
    <Table
      data-test-id="tasks-table"
      rowKey={rowKey}
      pagination={false}
      columns={columns}
      dataSource={transformData(get(data, "tasks", []))}
      onChange={tableChangeHandler}
      expandIcon={({
        expanded,
        onExpand,
        record,
      }: {
        record: any;
        expanded: boolean;
        onExpand: any;
      }) =>
        record.children && (
          <IconButton
            aria-label="Expand Display Task"
            onClick={(e) => onExpand(record, e)}
          >
            <Icon
              data-cy={`table-caret-icon-${record.id}`}
              glyph={expanded ? "CaretDown" : "CaretRight"}
            />
          </IconButton>
        )
      }
    />
  );
};

const arrayFormat = "comma";

const rowKey = ({ id }: { id: string }): string => id;
