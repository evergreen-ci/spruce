import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useTaskAnalytics } from "analytics";
import TasksTable from "components/TasksTable";
import { SortOrder, TaskQuery, Task } from "gql/generated/types";
import { useUpdateURLQueryParams } from "hooks/useUpdateURLQueryParams";
import { RequiredQueryParams, TableOnChange } from "types/task";
import { queryString } from "utils";

const { parseQueryString, parseSortString, toSortString } = queryString;

interface Props {
  execution: number;
  executionTasksFull: TaskQuery["task"]["executionTasksFull"];
  isPatch: boolean;
}

const useSorts = (): SortOrder[] => {
  const location = useLocation();

  const { sorts } = parseQueryString(location.search);
  return parseSortString(sorts);
};

export const ExecutionTasksTable: React.FC<Props> = ({
  execution,
  executionTasksFull,
  isPatch,
}) => {
  const taskAnalytics = useTaskAnalytics();
  const updateQueryParams = useUpdateURLQueryParams();
  const sorts = useSorts();
  useEffect(() => {
    if (sorts.length === 0) {
      updateQueryParams({
        sorts: "STATUS:ASC",
      });
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const tableChangeHandler: TableOnChange<Task> = (...[, , sorter]) => {
    updateQueryParams({
      sorts: toSortString(sorter),
      [RequiredQueryParams.Execution]: `${execution}`,
    });
  };
  const uniqueExecutions = new Set([
    execution,
    ...executionTasksFull.map((t) => t.execution),
  ]);
  return (
    <TasksTable
      isPatch={isPatch}
      showTaskExecutionLabel={uniqueExecutions.size > 1}
      sorts={sorts}
      tableChangeHandler={tableChangeHandler}
      tasks={executionTasksFull}
      onClickTaskLink={() =>
        taskAnalytics.sendEvent({ name: "Click Execution Task Link" })
      }
      onColumnHeaderClick={(sortField) =>
        taskAnalytics.sendEvent({
          name: "Sort Execution Tasks Table",
          sortBy: sortField,
        })
      }
    />
  );
};
