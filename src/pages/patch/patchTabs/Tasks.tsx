import React from "react";
import { useQuery } from "@apollo/react-hooks";
import { useParams } from "react-router-dom";
import {
  GET_PATCH_TASKS,
  PatchTasksQuery,
  PatchTasksVariables
} from "gql/queries/get-patch-tasks";
import { Patch } from "gql/queries/patch";
import { TasksTable } from "pages/patch/patchTabs/tasks/TasksTable";
import { P2 } from "components/Typography";

interface Props {
  patch: Patch;
  patchLoading: boolean;
}

export const Tasks: React.FC<Props> = ({ patch, patchLoading }) => {
  const { id } = useParams<{ id: string }>();
  const { data, loading, error, networkStatus } = useQuery<
    PatchTasksQuery,
    PatchTasksVariables
  >(GET_PATCH_TASKS, {
    variables: { patchId: id },
    notifyOnNetworkStatusChange: true
  });

  if (loading || patchLoading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>{error.message}</div>;
  }
  return (
    <>
      <P2>{data.patchTasks.length}/{patch.taskCount} tasks</P2>
      <TasksTable networkStatus={networkStatus} data={data.patchTasks} />
    </>
  );
};
