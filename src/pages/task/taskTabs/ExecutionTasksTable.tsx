import { useTaskAnalytics } from "analytics";
import { TasksTable } from "components/Table/TasksTable";
import { GetTaskQuery } from "gql/generated/types";
import { useTaskSortQueryParams } from "hooks/useTaskSortQueryParams";

interface Props {
  executionTasksFull: GetTaskQuery["task"]["executionTasksFull"];
}

export const ExecutionTasksTable: React.FC<Props> = ({
  executionTasksFull,
}) => {
  const taskAnalytics = useTaskAnalytics();
  const sorts = useTaskSortQueryParams();

  return (
    <TasksTable
      tasks={executionTasksFull}
      sorts={sorts}
      onClickTaskLink={() =>
        taskAnalytics.sendEvent({ name: "Click Execution Task Link" })
      }
    />
  );
};
