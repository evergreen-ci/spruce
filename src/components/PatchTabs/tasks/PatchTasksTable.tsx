import React from "react";
import { usePatchAnalytics } from "analytics";
import { TasksTable } from "components/Table/TasksTable";
import { Task, PatchTasksQuery, SortOrder } from "gql/generated/types";
import { useUpdateURLQueryParams } from "hooks/useUpdateURLQueryParams";
import { PatchTasksQueryParams, TableOnChange } from "types/task";
import { queryString } from "utils";

const { toSortString } = queryString;

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
    />
  );
};
