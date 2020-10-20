import React, { useState, useEffect } from "react";
import { useQuery } from "@apollo/client";
import styled from "@emotion/styled";
import { Tab } from "@leafygreen-ui/tabs";
import get from "lodash/get";
import { useParams, useLocation } from "react-router-dom";
import { useTaskAnalytics } from "analytics";
import { Banners } from "components/Banners";
import { BreadCrumb } from "components/Breadcrumb";
import BuildBaron from "components/Buildbaron/BuildBaron";
import { ErrorBoundary } from "components/ErrorBoundary";
import { PageTitle } from "components/PageTitle";
import {
  PageWrapper,
  PageContent,
  PageLayout,
  PageSider,
} from "components/styles";
import { StyledTabs } from "components/styles/StyledTabs";
import { TabLabelWithBadge } from "components/TabLabelWithBadge";
import { TaskStatusBadge } from "components/TaskStatusBadge";
import { pollInterval } from "constants/index";
import { paths } from "constants/routes";
import {
  useBannerDispatchContext,
  useBannerStateContext,
} from "context/banners";
import { GetTaskQuery, GetTaskQueryVariables } from "gql/generated/types";
import { GET_TASK, GET_TASK_LATEST_EXECUTION } from "gql/queries";
import { withBannersContext } from "hoc/withBannersContext";
import { useTabs, usePageTitle, useNetworkStatus } from "hooks";
import { useBuildBaronVariables } from "hooks/useBuildBaronVariables";
import { useUpdateURLQueryParams } from "hooks/useUpdateURLQueryParams";
import { ActionButtons } from "pages/task/ActionButtons";
import { ExecutionSelect } from "pages/task/executionDropdown/ExecutionSelector";
import { FilesTables } from "pages/task/FilesTables";
import { Logs } from "pages/task/Logs";
import { Metadata } from "pages/task/Metadata";
import { TestsTable } from "pages/task/TestsTable";
import { ExecutionAsDisplay, ExecutionAsData } from "pages/task/util/execution";
import { TaskTab, RequiredQueryParams } from "types/task";
import { parseQueryString } from "utils";
import { TrendCharts } from "./task/TrendCharts";

const tabToIndexMap = {
  [TaskTab.Logs]: 0,
  [TaskTab.Tests]: 1,
  [TaskTab.Files]: 2,
  [TaskTab.BuildBaron]: 3,
  [TaskTab.TrendCharts]: 4,
};

const TaskCore: React.FC = () => {
  const { id, tab } = useParams<{ id: string; tab: string | null }>();
  const dispatchBanner = useBannerDispatchContext();
  const bannersState = useBannerStateContext();
  const taskAnalytics = useTaskAnalytics();
  const location = useLocation();
  const updateQueryParams = useUpdateURLQueryParams();
  const parsed = parseQueryString(location.search);
  const initialExecution = Number(parsed[RequiredQueryParams.Execution]);
  const { data: latest } = useQuery<GetTaskQuery, GetTaskQueryVariables>(
    GET_TASK_LATEST_EXECUTION,
    {
      variables: { taskId: id },
      onError: (err) =>
        dispatchBanner.errorBanner(
          `There was an error loading the task: ${err.message}`
        ),
    }
  );
  const [execution, setExecution] = useState(
    !Number.isNaN(initialExecution)
      ? ExecutionAsData(initialExecution)
      : latest?.task?.latestExecution
  );
  useEffect(() => {
    if (Number.isNaN(initialExecution) && latest?.task) {
      setExecution(latest?.task?.latestExecution);
      updateQueryParams({
        execution: `${ExecutionAsDisplay(latest?.task?.latestExecution)}`,
      });
    }
  }, [latest, initialExecution, updateQueryParams]);

  // Query task data
  const { data, loading, error, startPolling, stopPolling } = useQuery<
    GetTaskQuery,
    GetTaskQueryVariables
  >(GET_TASK, {
    variables: { taskId: id, execution },
    pollInterval,
    onError: (err) =>
      dispatchBanner.errorBanner(
        `There was an error loading the task: ${err.message}`
      ),
  });

  useNetworkStatus(startPolling, stopPolling);
  const task = get(data, "task");
  const canAbort = get(task, "canAbort");
  const blocked = task?.blocked;
  const canRestart = get(task, "canRestart");
  const canSchedule = get(task, "canSchedule");
  const canUnschedule = get(task, "canUnschedule");
  const canSetPriority = get(task, "canSetPriority");
  const displayName = get(task, "displayName");
  const patchNumber = get(task, "patchNumber");
  const priority = get(task, "priority");
  const status = get(task, "status");
  const version = get(task, "version");
  const totalTestCount = get(task, "totalTestCount");
  const failedTestCount = get(task, "failedTestCount");
  const fileCount = get(data, "taskFiles.fileCount");
  const logLinks = get(task, "logs");
  const isPerfPluginEnabled = false;
  const patchAuthor = data?.task.patchMetadata.author;

  const {
    showBuildBaronTab,
    buildBaronData,
    buildBaronError,
    buildBaronLoading,
  } = useBuildBaronVariables({
    taskId: id,
    execution,
    taskStatus: task?.status,
  });

  usePageTitle(`Task${displayName ? ` - ${displayName}` : ""}`);

  // logic for tabs + updating url when they change
  const [selectedTab, selectTabHandler] = useTabs({
    tabToIndexMap,
    defaultTab: TaskTab.Logs,
    path: `${paths.task}/${id}`,
    query: new URLSearchParams(location.search),
    sendAnalyticsEvent: (newTab: string) =>
      taskAnalytics.sendEvent({ name: "Change Tab", tab: newTab }),
  });

  useEffect(() => {
    // the hierarchy of which tab loads first is:
    // 1. if the URL contains a tab, that trumps everything
    // 2. if the task has at least 1 test, load the tests tab
    // 3. otherwise load the logs tab (this default is set in the useTabs hook)
    if (tab in tabToIndexMap) {
      selectTabHandler(tabToIndexMap[tab]);
    } else if (!loading && totalTestCount > 0) {
      selectTabHandler(tabToIndexMap[TaskTab.Tests]);
    }
  }, [loading, location.pathname]); // eslint-disable-line react-hooks/exhaustive-deps

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
            <TaskStatusBadge status={status} blocked={blocked} />
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
          {task?.latestExecution > 0 && (
            <ExecutionSelect
              id={id}
              currentExecution={execution}
              latestExecution={latest?.task?.latestExecution}
              updateExecution={(n: number) => {
                setExecution(n);
                updateQueryParams({
                  execution: `${ExecutionAsDisplay(n)}`,
                });
              }}
            />
          )}
          <Metadata taskId={id} data={data} loading={loading} error={error} />
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

              {showBuildBaronTab && (
                <Tab name="Build Baron" id="task-build-baron-tab">
                  <BuildBaron
                    data={buildBaronData}
                    error={buildBaronError}
                    taskId={id}
                    loading={buildBaronLoading}
                  />
                </Tab>
              )}
              {isPerfPluginEnabled && (
                <Tab name="Trend Charts" id="trend-charts-tab">
                  <TrendCharts />
                </Tab>
              )}
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
