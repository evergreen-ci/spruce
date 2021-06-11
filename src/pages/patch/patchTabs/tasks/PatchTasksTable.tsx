import React from "react";
import { usePatchAnalytics } from "analytics";
import { TasksTable } from "components/Table/TasksTable";
import { Task, PatchTasksQuery, SortOrder } from "gql/generated/types";
import { useTaskFilters, useUpdateURLQueryParams } from "hooks";
import { PatchTasksQueryParams, TableOnChange } from "types/task";
import { toSortString } from "../util";

interface Props {
  patchTasks: PatchTasksQuery["patchTasks"];
  sorts: SortOrder[];
}

export const PatchTasksTable: React.FC<Props> = ({ patchTasks, sorts }) => {
  const updateQueryParams = useUpdateURLQueryParams();

  const patchAnalytics = usePatchAnalytics();
  const tableChangeHandler: TableOnChange<Task> = (...[, , sorter]) => {
    updateQueryParams({
      sorts: toSortString(sorter),
      [PatchTasksQueryParams.Page]: "0",
    });
  };
  const taskFilters = useTaskFilters();

  return (
    <TasksTable
      sorts={sorts}
      tableChangeHandler={tableChangeHandler}
      tasks={patchTasks?.tasks}
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
      taskFilters={taskFilters}
    />
  );
};
