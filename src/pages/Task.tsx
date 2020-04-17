import React from "react";
import { useParams } from "react-router-dom";
import { TestsTable } from "pages/task/TestsTable";
import { FilesTables } from "pages/task/FilesTables";
import { BreadCrumb } from "components/Breadcrumb";
import { TaskStatusBadge } from "components/TaskStatusBadge";
import { PageTitle } from "components/PageTitle";
import { Logs } from "pages/task/Logs";
import { useQuery } from "@apollo/react-hooks";
import { ErrorBoundary } from "components/ErrorBoundary";
import {
  PageWrapper,
  PageContent,
  PageLayout,
  PageSider,
} from "components/styles";
import { GET_TASK, TaskQuery } from "gql/queries/get-task";
import { useDefaultPath, useTabs } from "hooks";
import { Tab } from "@leafygreen-ui/tabs";
import { StyledTabs } from "components/styles/StyledTabs";
import { paths } from "contants/routes";
import { Metadata } from "./task/Metadata";
import get from "lodash/get";
import { TaskStatus } from "types/task";
import { TabLabelWithBadge } from "components/TabLabelWithBadge";

enum TaskTab {
  Logs = "logs",
  Tests = "tests",
  Files = "files",
  BuildBaron = "build-baron",
}
const tabToIndexMap = {
  [TaskTab.Logs]: 0,
  [TaskTab.Tests]: 1,
  [TaskTab.Files]: 2,
  [TaskTab.BuildBaron]: 3,
};
const DEFAULT_TAB = TaskTab.Logs;

export const Task: React.FC = () => {
  useDefaultPath(tabToIndexMap, paths.task, DEFAULT_TAB);
  const [selectedTab, selectTabHandler] = useTabs(
    tabToIndexMap,
    paths.task,
    DEFAULT_TAB
  );

  const { id } = useParams<{ id: string }>();
  const { data, loading, error, stopPolling } = useQuery<TaskQuery>(GET_TASK, {
    variables: { taskId: id },
    pollInterval: 2000,
  });

  const task = get(data, "task");
  const displayName = get(task, "displayName");
  const patchNumber = get(task, "patchNumber");
  const status = get(task, "status");
  const version = get(task, "version");
  const failedTestCount = get(task, "failedTestCount");

  if (
    status === TaskStatus.Failed ||
    status === TaskStatus.Succeeded ||
    status === TaskStatus.SetupFailed ||
    status === TaskStatus.SystemFailed ||
    status === TaskStatus.TestTimedOut
  ) {
    stopPolling();
  }

  return (
    <PageWrapper>
      {task && (
        <BreadCrumb
          taskName={displayName}
          versionId={version}
          patchNumber={patchNumber}
        />
      )}
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
          <Metadata data={data} loading={loading} error={error} />
        </PageSider>
        <PageLayout>
          <PageContent>
            <StyledTabs selected={selectedTab} setSelected={selectTabHandler}>
              <Tab name="Logs" id="task-logs-tab">
                <Logs />
              </Tab>
              <Tab
                name={
                  <span>
                    {failedTestCount ? (
                      <TabLabelWithBadge
                        tabLabel="Tests"
                        badgeVariant="red"
                        badgeText={failedTestCount}
                        dataCyBadge="test-tab-badge"
                      />
                    ) : (
                      "Tests"
                    )}
                  </span>
                }
                id="task-tests-tab"
              >
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
