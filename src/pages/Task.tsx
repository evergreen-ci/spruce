import React, { useEffect } from "react";
import { RouteComponentProps } from "react-router-dom";
import { useParams, useHistory } from "react-router-dom";
import { TestsTable } from "pages/task/TestsTable";
import { TaskBreadcrumb } from "pages/task/TaskBreadcrumb";
import gql from "graphql-tag";
import { useQuery } from "@apollo/react-hooks";

export enum Tab {
  Logs = "logs",
  Tests = "tests",
  Files = "files",
  BuildBaron = "build-baron"
}
const DEFAULT_TAB = Tab.Logs;

const GET_TASK = gql`
  query GetTask($taskId: String!) {
    task(taskId: $taskId) {
      version
      displayName
    }
  }
`;

interface TaskQuery {
  task: {
    version: string;
    displayName: string;
  };
}

export const Task: React.FC = () => {
  const { tab, taskID } = useParams<{ tab?: Tab; taskID: string }>();
  const history = useHistory();
  useEffect(() => {
    if (!tab) {
      history.replace(`/task/${taskID}/${DEFAULT_TAB}`);
    }
  }, [tab, taskID, history]);

  const { data, loading } = useQuery<TaskQuery>(GET_TASK, {
    variables: { taskId: taskID }
  });

  if (loading) {
    return <div>"Loading..."</div>;
  }

  const {
    task: { displayName, version }
  } = data;

  return (
    <>
      <TaskBreadcrumb displayName={displayName} version={version} />
      {tab === Tab.Tests && <TestsTable />}
    </>
  );
};
