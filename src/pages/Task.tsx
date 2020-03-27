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
  PageContent,
  PageLayout,
  PageSider
} from "components/styles";
import { useDefaultPath, useTabs } from "hooks";
import { Tab } from "@leafygreen-ui/tabs";
import { StyledTabs } from "components/styles/StyledTabs";
import { paths } from "contants/routes";
import { Metadata } from "./task/Metadata";

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
export interface Patch {
  id: string;
  description: string;
  projectID: string;
  githash: string;
  patchNumber: number;
  author: string;
  version: string;
  status: string;
  activated: string;
  alias: string;
  taskCount: string;
  duration: {
    makespan: string;
    timeTaken: string;
  };
  time: {
    started?: string;
    finished?: string;
    submittedAt: string;
  };
}

export interface PatchQuery {
  patch: Patch;
}

const GET_TASK = gql`
  query GetTask($taskId: String!) {
    task(taskId: $taskId) {
      version
      displayName
      patchNumber
      status
      activatedBy
      createTime
      startTime
      finishTime
      timeTaken
      baseCommitDuration
      hostId
      reliesOn
    }
  }
`;

interface Dependency {
  name: string;
  metStatus: MetStatus;
  requiredStatus: RequiredStatus;
  buildVariant: string;
}
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
    reliesOn: Dependency[];
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
          <Metadata data={data} loading={loading} />
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
