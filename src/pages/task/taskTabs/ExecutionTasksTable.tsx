import { useEffect } from "react";
import { useTaskAnalytics } from "analytics";
import { TasksTable } from "components/Table/TasksTable";
import { GetTaskQuery, Task } from "gql/generated/types";
import { useUpdateURLQueryParams } from "hooks/useUpdateURLQueryParams";
import { useLocation } from "react-router-dom";
import { RequiredQueryParams, TableOnChange } from "types/task";
import { queryString } from "utils";

const { parseQueryString, parseSortString, toSortString } = queryString;

interface Props {
  execution: number;
  executionTasksFull: GetTaskQuery["task"]["executionTasksFull"];
}

const useSorts = () => {
  const location = useLocation();

  const { sorts } = parseQueryString(location.search);
  return parseSortString(sorts);
};

export const ExecutionTasksTable: React.VFC<Props> = ({
  execution,
  executionTasksFull,
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

  return (
    <TasksTable
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
