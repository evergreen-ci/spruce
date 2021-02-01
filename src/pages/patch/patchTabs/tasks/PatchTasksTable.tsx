import React from "react";
import get from "lodash/get";
import { useHistory, useLocation } from "react-router-dom";
import { usePatchAnalytics } from "analytics";
import { TasksTable } from "components/Table/TasksTable";
import { TaskResult, PatchTasks, SortOrder } from "gql/generated/types";
import { PatchTasksQueryParams, TableOnChange } from "types/task";
import { stringifyQuery, parseQueryString } from "utils/queryString";
import { toSortString } from "../util";

interface Props {
  data?: PatchTasks;
  sorts: SortOrder[];
}

export const PatchTasksTable: React.FC<Props> = ({ data, sorts }) => {
  const { replace } = useHistory();
  const { search, pathname } = useLocation();

  const patchAnalytics = usePatchAnalytics();
  const tableChangeHandler: TableOnChange<TaskResult> = (...[, , sorter]) => {
    const nextQueryParams = stringifyQuery({
      ...parseQueryString(search),
      sorts: toSortString(sorter),
      [PatchTasksQueryParams.Page]: "0",
    });
    if (nextQueryParams !== search.split("?")[1]) {
      replace(`${pathname}?${nextQueryParams}`);
    }
  };

  return (
    <TasksTable
      sorts={sorts}
      tableChangeHandler={tableChangeHandler}
      tasks={get(data, "tasks", []) as TaskResult[]}
      onExpand={(expanded) => {
        patchAnalytics.sendEvent({
          name: "Toggle Display Task Dropdown",
          expanded,
        });
      }}
      onClickTaskLink={(taskId) =>
        patchAnalytics.sendEvent({
          name: "Click Task Table Link",
          taskId,
        })
      }
    />
  );
};
