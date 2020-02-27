import React from "react";
import { useParams } from "react-router-dom";
import {
  GET_TASK_FILES,
  TaskFilesResponse,
  TaskFilesVars
} from "gql/queries/get-task-files";
import { useQuery } from "@apollo/react-hooks/lib/useQuery";

export const FilesTables: React.FC = () => {
  const { taskID } = useParams();
  const { data, loading, error } = useQuery<TaskFilesResponse, TaskFilesVars>(
    GET_TASK_FILES,
    {
      variables: {
        id: taskID
      }
    }
  );

  if (loading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>{error.message}</div>;
  }

  console.log(data);
  return (
    <>
      {data.taskFiles.map(({ taskName, files }) => {
        return <div key={taskName}>{taskName}</div>;
      })}
    </>
  );
};
