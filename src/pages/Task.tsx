import React from "react";
import { useParams } from "react-router-dom";
import { TestsTable } from "pages/task/TestsTable";
import { FilesTables } from "./task/FilesTables";
import { BreadCrumb } from "components/Breadcrumb";
import { TaskStatusBadge } from "components/TaskStatusBadge";
import { PageTitle } from "components/PageTitle";
import { Logs } from "pages/task/Logs";
import gql from "graphql-tag";
import { useQuery } from "@apollo/react-hooks";
import { ErrorBoundary } from "components/ErrorBoundary";
import {
  PageWrapper,
  SiderCard,
  PageContent,
  PageLayout,
  PageSider,
  Divider
} from "components/styles";
import { useDefaultPath, useTabs } from "hooks";
import { Tab } from "@leafygreen-ui/tabs";
import { StyledTabs } from "components/styles/StyledTabs";
import { paths } from "contants/routes";
import { H3, P2 } from "components/Typography";
import { Skeleton } from "antd";

enum TaskTab {
  Logs = "logs",
  Tests = "tests",
  Files = "files",
  BuildBaron = "build-baron"
}
const tabToIndexMap = {
  [TaskTab.Logs]: 0,
  [TaskTab.Tests]: 1,
  [TaskTab.Files]: 2,
  [TaskTab.BuildBaron]: 3
};
const DEFAULT_TAB = TaskTab.Logs;

const GET_TASK = gql`
  query GetTask($taskId: String!) {
    task(taskId: $taskId) {
      version
      displayName
      patchNumber
      status
<<<<<<< HEAD
      activatedBy
      createTime
      startTime
      finishTime
      timeTaken
      baseCommitDuration
      hostId
=======
>>>>>>> 0b4effda22a90691ac056023f238deceea33b9c5
    }
  }
`;

interface TaskQuery {
  task: {
    version: string;
    displayName: string;
    patchNumber: number;
    status: string;
    activatedBy: string;
    createTime: string;
    startTime: string;
    finishTime: string;
    timeTaken: number;
    baseCommitDuration: number;
    hostId: string;
  };
}

export const Task: React.FC = () => {
  useDefaultPath(tabToIndexMap, paths.task, DEFAULT_TAB);
  const [selectedTab, selectTabHandler] = useTabs(
    tabToIndexMap,
    paths.task,
    DEFAULT_TAB
  );

  const { id } = useParams<{ id: string }>();
  const { data, loading, error } = useQuery<TaskQuery>(GET_TASK, {
    variables: { taskId: id }
  });

  if (loading) {
    return <div>"Loading..."</div>;
  }
  if (error) {
    return <div>{error.message}</div>;
  }
  const {
    task: {
      displayName,
      version,
      patchNumber,
      status,
      activatedBy,
      createTime,
      startTime,
      finishTime,
      timeTaken,
      baseCommitDuration,
      hostId
    }
  } = data;

  return (
    <PageWrapper>
      <BreadCrumb
        taskName={displayName}
        versionId={version}
        patchNumber={patchNumber}
      />
      <PageTitle
        loading={loading}
        hasData={!!(displayName && status)}
        title={displayName}
        badge={
          <ErrorBoundary>
            <TaskStatusBadge status={status} />
          </ErrorBoundary>
        }
      />
      <PageLayout>
        <PageSider>
          <SiderCard>
            {loading ? (
              <Skeleton active={true} title={false} paragraph={{ rows: 4 }} />
            ) : (
              <>
                <H3>Task Metadata</H3>
                <Divider />
                <P2>Submitted by: {activatedBy}</P2>
                <P2>Submitted at: {createTime}</P2>
                <P2>Started: {startTime}</P2>
                <P2>Finished: {finishTime}</P2>
                <P2>Duration: {timeTaken} </P2>
                <P2>Base commit duration: {baseCommitDuration}</P2>
                <P2>Base commit</P2>
                <P2>Host: {hostId}</P2>
                <div />
              </>
            )}
            <H3>Depends On</H3>
            <Divider />
          </SiderCard>
        </PageSider>
        <PageLayout>
          <PageContent>
            <StyledTabs selected={selectedTab} setSelected={selectTabHandler}>
              <Tab name="Logs" id="task-logs-tab">
                <Logs />
              </Tab>
              <Tab name="Tests" id="task-tests-tab">
                <TestsTable />
              </Tab>
              <Tab name="Files" id="task-files-tab">
                <FilesTables />
              </Tab>
            </StyledTabs>
          </PageContent>
        </PageLayout>
      </PageLayout>
    </PageWrapper>
  );
};
