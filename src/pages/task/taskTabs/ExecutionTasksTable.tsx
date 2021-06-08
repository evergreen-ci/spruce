import { useTaskAnalytics } from "analytics";
import { TasksTable } from "components/Table/TasksTable";
import { GetTaskQuery, Task } from "gql/generated/types";
import { useTaskSortQueryParams } from "hooks/useTaskSortQueryParams";
import { useUpdateURLQueryParams } from "hooks/useUpdateURLQueryParams";
import { toSortString } from "pages/patch/patchTabs/util";
import { RequiredQueryParams, TableOnChange } from "types/task";

interface Props {
  executionTasksFull: GetTaskQuery["task"]["executionTasksFull"];
}

export const ExecutionTasksTable: React.FC<Props> = ({
  executionTasksFull,
}) => {
  const taskAnalytics = useTaskAnalytics();
  const updateQueryParams = useUpdateURLQueryParams();
  const sorts = useTaskSortQueryParams();

  const tableChangeHandler: TableOnChange<Task> = (...[, , sorter]) => {
    updateQueryParams({
      sorts: toSortString(sorter),
      [RequiredQueryParams.Execution]: "0",
    });
  };

  return (
    <TasksTable
      tableChangeHandler={tableChangeHandler}
      tasks={executionTasksFull}
      sorts={sorts}
      onClickTaskLink={() =>
        taskAnalytics.sendEvent({ name: "Click Execution Task Link" })
      }
    />
  );
};
