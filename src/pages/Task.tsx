import React from "react";
import styled from "@emotion/styled";
import { useParams } from "react-router-dom";
import { TestsTable } from "pages/task/TestsTable";
import { FilesTables } from "pages/task/FilesTables";
import { BreadCrumb } from "components/Breadcrumb";
import { TaskStatusBadge } from "components/TaskStatusBadge";
import { PageTitle } from "components/PageTitle";
import { Logs } from "pages/task/Logs";
import { useQuery } from "@apollo/react-hooks";
import { ErrorBoundary } from "components/ErrorBoundary";
import { ActionButtons } from "pages/task/ActionButtons";
import {
  PageWrapper,
  PageContent,
  PageLayout,
  PageSider,
} from "components/styles";
import { GET_TASK } from "gql/queries/get-task";
import { GetTaskQuery, GetTaskQueryVariables } from "gql/generated/types";
import { useDefaultPath, useTabs, usePageTitle, useNetworkStatus } from "hooks";
import { Tab } from "@leafygreen-ui/tabs";
import { StyledTabs } from "components/styles/StyledTabs";
import { paths } from "constants/routes";
import get from "lodash/get";
import {
  useBannerDispatchContext,
  useBannerStateContext,
} from "context/banners";
import { Banners } from "components/Banners";
import { withBannersContext } from "hoc/withBannersContext";
import { TaskTab } from "types/task";
import { TabLabelWithBadge } from "components/TabLabelWithBadge";
import { Metadata } from "pages/task/Metadata";
import { useTaskAnalytics } from "analytics";
import { pollInterval } from "constants/index";

const tabToIndexMap = {
  [TaskTab.Logs]: 0,
  [TaskTab.Tests]: 1,
  [TaskTab.Files]: 2,
  [TaskTab.BuildBaron]: 3,
};
const DEFAULT_TAB = TaskTab.Logs;

const TaskCore: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatchBanner = useBannerDispatchContext();
  const bannersState = useBannerStateContext();
  const taskAnalytics = useTaskAnalytics();
  // automatically append default tab to end of url path
  useDefaultPath({
    tabToIndexMap,
    defaultPath: `${paths.task}/${id}/${DEFAULT_TAB}`,
  });

  // logic for tabs + updating url when they change
  const [selectedTab, selectTabHandler] = useTabs({
    tabToIndexMap,
    defaultTab: DEFAULT_TAB,
    path: `${paths.task}/${id}`,
    sendAnalyticsEvent: (tab: string) =>
      taskAnalytics.sendEvent({ name: "Change Tab", tab }),
  });

  // Query task data
  const { data, loading, error, startPolling, stopPolling } = useQuery<
    GetTaskQuery,
    GetTaskQueryVariables
  >(GET_TASK, {
    variables: { taskId: id },
    pollInterval,
    onError: (err) =>
      dispatchBanner.errorBanner(
        `There was an error loading the task: ${err.message}`
      ),
  });
  useNetworkStatus(startPolling, stopPolling);
  const task = get(data, "task");
  const canAbort = get(task, "canAbort");
  const canRestart = get(task, "canRestart");
  const canSchedule = get(task, "canSchedule");
  const canUnschedule = get(task, "canUnschedule");
  const canSetPriority = get(task, "canSetPriority");
  const displayName = get(task, "displayName");
  const patchNumber = get(task, "patchNumber");
  const priority = get(task, "priority");
  const status = get(task, "status");
  const version = get(task, "version");
  const failedTestCount = get(task, "failedTestCount");
  const fileCount = get(data, "taskFiles.fileCount");
  const logLinks = get(task, "logs");
  const patchAuthor = data?.task.patchMetadata.author;
  usePageTitle(`Task${displayName ? ` - ${displayName}` : ""}`);

  if (error) {
    stopPolling();
  }

  if (error) {
    return (
      <PageWrapper>
        <Banners
          banners={bannersState}
          removeBanner={dispatchBanner.removeBanner}
        />
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <Banners
        banners={bannersState}
        removeBanner={dispatchBanner.removeBanner}
      />
      {task && (
        <BreadCrumb
          patchAuthor={patchAuthor}
          patchNumber={patchNumber}
          taskName={displayName}
          versionId={version}
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
        buttons={
          <ActionButtons
            canAbort={canAbort}
            canRestart={canRestart}
            canSchedule={canSchedule}
            canUnschedule={canUnschedule}
            canSetPriority={canSetPriority}
            initialPriority={priority}
          />
        }
      />
      <PageLayout>
        <PageSider>
          <Metadata data={data} loading={loading} error={error} />
        </PageSider>
        <LogWrapper>
          <PageContent>
            <StyledTabs selected={selectedTab} setSelected={selectTabHandler}>
              <Tab name="Logs" id="task-logs-tab">
                <Logs logLinks={logLinks} />
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
              <Tab
                name={
                  <span>
                    {fileCount !== undefined ? (
                      <TabLabelWithBadge
                        tabLabel="Files"
                        badgeVariant="lightgray"
                        badgeText={fileCount}
                        dataCyBadge="files-tab-badge"
                      />
                    ) : (
                      "Files"
                    )}
                  </span>
                }
                id="task-files-tab"
              >
                <FilesTables />
              </Tab>
            </StyledTabs>
          </PageContent>
        </LogWrapper>
      </PageLayout>
    </PageWrapper>
  );
};

export const Task = withBannersContext(TaskCore);

const LogWrapper = styled(PageLayout)`
  width: 100%;
`;
