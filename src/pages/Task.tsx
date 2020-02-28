import React, { useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import { Tab, TaskURLParams } from "pages/types/task";
import { BreadCrumb } from "components/Breadcrumb";
import gql from "graphql-tag";
import { useQuery } from "@apollo/react-hooks";
import { H1 } from "components/Typography";
import { TaskPageBody } from "pages/task/TaskPageBody";
import {
  PageWrapper,
  SiderCard,
  PageHeader,
  PageContent,
  PageLayout,
  PageSider
} from "components/styles";

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
  const { tab, taskID } = useParams<TaskURLParams>();
  const history = useHistory();
  useEffect(() => {
    if (!tab) {
      history.replace(`/task/${taskID}/${DEFAULT_TAB}`);
    }
  }, [tab, taskID, history]);

  const { data, loading, error } = useQuery<TaskQuery>(GET_TASK, {
    variables: { taskId: taskID }
  });

  if (loading) {
    return <div>"Loading..."</div>;
  }
  if (error) {
    return <div>{error.message}</div>;
  }

  const {
    task: { displayName, version }
  } = data;

  return (
    <PageWrapper>
      <BreadCrumb displayName={displayName} version={version} isTask={true} />
      <PageHeader>
        <H1>Current Task Name</H1>
      </PageHeader>
      <PageLayout>
        <PageSider>
          <SiderCard>Patch Metadata</SiderCard>
          <SiderCard>Build Variants</SiderCard>
        </PageSider>
        <PageLayout>
          <PageContent>
            <TaskPageBody />
          </PageContent>
        </PageLayout>
      </PageLayout>
    </PageWrapper>
  );
};
