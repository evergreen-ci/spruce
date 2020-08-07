import React, { useState } from "react";
import styled from "@emotion/styled";
import { useParams, useLocation } from "react-router-dom";
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
import { GET_TASK_ALL_EXECUTIONS } from "gql/queries/get-task-all-executions";
import {
  GetTaskQuery,
  GetTaskQueryVariables,
  GetTaskAllExecutionsQuery,
  GetTaskAllExecutionsQueryVariables,
} from "gql/generated/types";
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
import { TaskTab, RequiredQueryParams } from "types/task";
import { TabLabelWithBadge } from "components/TabLabelWithBadge";
import { Metadata } from "pages/task/Metadata";
import { useTaskAnalytics } from "analytics";
import { pollInterval } from "constants/index";
import { Select } from "antd";
import { shortDate } from "utils/string";
import {
  mapVariantTaskStatusToColor,
  Square,
} from "pages/patch/buildVariants/variantColors"; // TODO: move somewhere
import { P1 } from "components/Typography";
import { useUpdateURLQueryParams } from "hooks/useUpdateURLQueryParams";
import { parseQueryString } from "utils";
import { ExecutionAsDisplay, ExecutionAsData } from "pages/task/util/execution";

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
  const { search: queryVars } = useLocation();
  const parsed = parseQueryString(queryVars);
  const initialExecution = Number(parsed[RequiredQueryParams.Execution]);
  const [execution, setExecution] = useState(
    !Number.isNaN(initialExecution) ? ExecutionAsData(initialExecution) : null
  );
  const taskAnalytics = useTaskAnalytics();
  // automatically append default tab to end of url path
  useDefaultPath({
    tabToIndexMap,
    defaultPath: `${paths.task}/${id}/${DEFAULT_TAB}`,
  });

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
  const allExecutionsResult = useQuery<
    GetTaskAllExecutionsQuery,
    GetTaskAllExecutionsQueryVariables
  >(GET_TASK_ALL_EXECUTIONS, {
    variables: { taskId: id },
  });
  const allExecutions = allExecutionsResult?.data?.taskAllExecutions;
  const executionsLoading = allExecutionsResult?.loading;
  const { Option } = Select;
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
  const updateQueryParams = useUpdateURLQueryParams();
  // logic for tabs + updating url when they change
  const [selectedTab, selectTabHandler] = useTabs({
    tabToIndexMap,
    defaultTab: DEFAULT_TAB,
    path: `${paths.task}/${id}`,
    query: new URLSearchParams(
      `${RequiredQueryParams.Execution}=${ExecutionAsDisplay(
        execution || task?.latestExecution
      )}`
    ),
    sendAnalyticsEvent: (tab: string) =>
      taskAnalytics.sendEvent({ name: "Change Tab", tab }),
  });

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
          {task?.latestExecution > 0 && (
            <StyledSelect
              placeholder="Choose an execution"
              disabled={executionsLoading}
              key={execution}
              data-test-id="execution-select"
              value={`Execution ${ExecutionAsDisplay(
                execution === null ? task?.latestExecution : execution
              )}${
                execution === null || execution === task?.latestExecution
                  ? " (latest)"
                  : ""
              }`}
              onChange={(selected: number | null) => {
                setExecution(selected);
                updateQueryParams({
                  execution: `${ExecutionAsDisplay(selected)}`,
                });
              }}
            >
              {allExecutions?.map((singleExecution) => (
                <Option
                  key={singleExecution.execution}
                  value={singleExecution.execution}
                  data-test-id={`execution-${singleExecution.execution}`}
                >
                  <StyledSquare
                    color={mapVariantTaskStatusToColor[singleExecution.status]}
                  />
                  <StyledP1>
                    {" "}
                    Execution {ExecutionAsDisplay(
                      singleExecution.execution
                    )} - {shortDate(singleExecution.createTime)}
                  </StyledP1>
                </Option>
              ))}
            </StyledSelect>
          )}
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
const StyledSelect = styled(Select)`
  margin-bottom: 10px;
  width: 100%;
`;
const StyledSquare = styled(Square)`
  float: left;
  width: 17px;
  height: 17px;
  margin-right: 3px;
`;
const StyledP1 = styled(P1)`
  float: left;
`;
