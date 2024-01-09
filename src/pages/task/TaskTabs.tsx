import { useState, useEffect } from "react";
import { Tab } from "@leafygreen-ui/tabs";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useTaskAnalytics } from "analytics";
import { TrendChartsPlugin } from "components/PerfPlugin";
import { StyledTabs } from "components/styles/StyledTabs";
import { TabLabelWithBadge } from "components/TabLabelWithBadge";
import { getTaskRoute, GetTaskRouteOptions } from "constants/routes";
import { TaskQuery } from "gql/generated/types";
import { usePrevious } from "hooks";
import { useTabShortcut } from "hooks/useTabShortcut";
import { TaskTab } from "types/task";
import { queryString } from "utils";
import { BuildBaron } from "./taskTabs/buildBaron";
import { useBuildBaronVariables } from "./taskTabs/buildBaronAndAnnotations";
import { ExecutionTasksTable } from "./taskTabs/ExecutionTasksTable";
import FileTable from "./taskTabs/FileTable";
import { Logs } from "./taskTabs/Logs";
import { TestsTable } from "./taskTabs/TestsTable";

const { parseQueryString } = queryString;
interface TaskTabProps {
  isDisplayTask: boolean;
  task: TaskQuery["task"];
}
export const TaskTabs: React.FC<TaskTabProps> = ({ isDisplayTask, task }) => {
  const { tab: urlTab } = useParams<{ id: string; tab: TaskTab | null }>();

  const navigate = useNavigate();
  const location = useLocation();
  const taskAnalytics = useTaskAnalytics();
  const {
    annotation,
    canModifyAnnotation,
    execution,
    executionTasksFull,
    failedTestCount,
    files,
    id,
    isPerfPluginEnabled,
    logs: logLinks,
    status,
    totalTestCount,
    versionMetadata,
  } = task ?? {};
  const { fileCount } = files ?? {};

  const { showBuildBaron } = useBuildBaronVariables({
    task: {
      id,
      execution,
      status,
      canModifyAnnotation,
      hasAnnotation: !!annotation,
    },
  });

  const tabMap = {
    [TaskTab.Logs]: (
      <Tab name="Logs" data-cy="task-logs-tab" key="task-logs-tab">
        <Logs taskId={id} execution={execution} logLinks={logLinks} />
      </Tab>
    ),
    [TaskTab.Tests]: (
      <Tab
        name={
          <span>
            {failedTestCount ? (
              <TabLabelWithBadge
                tabLabel="Tests"
                badgeVariant="red"
                badgeText={failedTestCount}
                dataCyBadge="tests-tab-badge"
              />
            ) : (
              "Tests"
            )}
          </span>
        }
        data-cy="task-tests-tab"
        key="task-tests-tab"
      >
        <TestsTable task={task} />
      </Tab>
    ),
    [TaskTab.ExecutionTasks]: (
      <Tab
        name="Execution Tasks"
        data-cy="task-execution-tab"
        key="execution-tasks-tab"
      >
        <ExecutionTasksTable
          execution={execution}
          executionTasksFull={executionTasksFull}
          isPatch={versionMetadata?.isPatch}
        />
      </Tab>
    ),
    [TaskTab.Files]: (
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
        data-cy="task-files-tab"
        key="task-files-tab"
      >
        <FileTable taskId={id} execution={execution} />
      </Tab>
    ),
    [TaskTab.Annotations]: (
      <Tab
        name="Failure Details"
        data-cy="task-build-baron-tab"
        key="task-build-baron-tab"
      >
        <BuildBaron
          annotation={annotation}
          taskId={id}
          execution={execution}
          userCanModify={canModifyAnnotation}
        />
      </Tab>
    ),
    [TaskTab.TrendCharts]: (
      <Tab
        name="Trend Charts"
        data-cy="trend-charts-tab"
        key="trend-charts-tab"
      >
        <TrendChartsPlugin taskId={id} />
      </Tab>
    ),
  };

  const tabIsActive = {
    [TaskTab.Logs]: !isDisplayTask,
    [TaskTab.ExecutionTasks]: isDisplayTask,
    [TaskTab.Tests]: true,
    [TaskTab.Files]: true,
    [TaskTab.Annotations]: showBuildBaron,
    [TaskTab.TrendCharts]: isPerfPluginEnabled,
  };

  const activeTabs = Object.keys(tabMap).filter(
    (tab) => tabIsActive[tab]
  ) as TaskTab[];

  let defaultTab = 0;
  if (urlTab && activeTabs.indexOf(urlTab) > -1) {
    defaultTab = activeTabs.indexOf(urlTab);
  } else if (isDisplayTask) {
    defaultTab = activeTabs.indexOf(TaskTab.ExecutionTasks);
  } else if (totalTestCount > 0) {
    defaultTab = activeTabs.indexOf(TaskTab.Tests);
  }
  const [selectedTab, setSelectedTab] = useState(defaultTab);
  // This is used to keep track of the first tab transition so we dont accidently trigger an analytics event for it
  const previousTab = usePrevious(selectedTab);

  useTabShortcut({
    currentTab: selectedTab,
    numTabs: activeTabs.length,
    setSelectedTab,
  });

  useEffect(() => {
    if (previousTab !== selectedTab) {
      const query = parseQueryString(location.search);
      const params: GetTaskRouteOptions = {
        tab: activeTabs[selectedTab],
        ...query,
      };

      if (
        id === task?.id &&
        query.execution === undefined &&
        task.latestExecution !== undefined
      ) {
        params.execution = task.latestExecution;
      }

      const newRoute = getTaskRoute(id, params);
      navigate(newRoute, { replace: true });

      if (previousTab !== undefined) {
        taskAnalytics.sendEvent({
          name: "Change Tab",
          tab: activeTabs[selectedTab],
        });
      }
    }
  }, [selectedTab]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <StyledTabs
      selected={selectedTab}
      setSelected={setSelectedTab}
      aria-label="Task Page Tabs"
    >
      {activeTabs.map((tab: string) => tabMap[tab])}
    </StyledTabs>
  );
};
