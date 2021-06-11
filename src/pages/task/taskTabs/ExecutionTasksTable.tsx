import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useTaskAnalytics } from "analytics";
import { TasksTable } from "components/Table/TasksTable";
import { GetTaskQuery, Task } from "gql/generated/types";
import { useUpdateURLQueryParams } from "hooks/useUpdateURLQueryParams";
import { parseSortString, toSortString } from "pages/patch/patchTabs/util";
import { RequiredQueryParams, TableOnChange } from "types/task";
import { queryString } from "utils";

const { parseQueryString } = queryString;

interface Props {
  executionTasksFull: GetTaskQuery["task"]["executionTasksFull"];
}

const useSorts = () => {
  const location = useLocation();

  const { sorts } = parseQueryString(location.search);
  return parseSortString(sorts);
};

export const ExecutionTasksTable: React.FC<Props> = ({
  executionTasksFull,
}) => {
  const taskAnalytics = useTaskAnalytics();
  const updateQueryParams = useUpdateURLQueryParams();
  // const sorts = useTaskSortQueryParams();
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
      [RequiredQueryParams.Execution]: "0",
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
    />
  );
};
