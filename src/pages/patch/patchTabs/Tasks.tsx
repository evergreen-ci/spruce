import React from "react";
import { useQuery } from "@apollo/react-hooks";
import { useParams } from "react-router-dom";
import { GET_PATCH_TASKS, PatchTasksQuery } from "gql/queries/get-patch-tasks";
import { TasksTable } from "pages/patch/patchTabs/tasks/TasksTable";

export const Tasks: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const { data, loading, error, networkStatus } = useQuery<PatchTasksQuery>(
    GET_PATCH_TASKS,
    {
      variables: { patchId: id },
      notifyOnNetworkStatusChange: true
    }
  );

  if (loading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>{error.message}</div>;
  }
  return (
    <>
      <TasksTable networkStatus={networkStatus} data={data.patchTasks} />
    </>
  );
};
