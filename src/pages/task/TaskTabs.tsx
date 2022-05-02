import { useState, useEffect } from "react";
import { Tab } from "@leafygreen-ui/tabs";
import { useParams, useHistory, useLocation } from "react-router-dom";
import { useTaskAnalytics } from "analytics";
import { TrendChartsPlugin } from "components/PerfPlugin";
import { StyledTabs } from "components/styles/StyledTabs";
import { TabLabelWithBadge } from "components/TabLabelWithBadge";
import { getTaskRoute } from "constants/routes";
import { GetTaskQuery } from "gql/generated/types";
import { usePrevious } from "hooks";
import { TaskTab } from "types/task";
import { queryString } from "utils";
import { BuildBaron } from "./taskTabs/BuildBaron";
import { useBuildBaronVariables } from "./taskTabs/buildBaronAndAnnotations";
import { ExecutionTasksTable } from "./taskTabs/ExecutionTasksTable";
import { FilesTables } from "./taskTabs/FilesTables";
import { Logs } from "./taskTabs/Logs";
import { TestsTable } from "./taskTabs/TestsTable";

const { parseQueryString } = queryString;
interface TaskTabProps {
  task: GetTaskQuery["task"];
  taskFiles: GetTaskQuery["taskFiles"];
}
export const TaskTabs: React.VFC<TaskTabProps> = ({ task, taskFiles }) => {
  const { tab: urlTab } = useParams<{ id: string; tab: TaskTab | null }>();

  const history = useHistory();
  const location = useLocation();
  const taskAnalytics = useTaskAnalytics();
  const {
    status,
    failedTestCount,
    logs: logLinks,
    isPerfPluginEnabled,
    annotation,
    canModifyAnnotation,
    id,
    execution,
    totalTestCount,
    executionTasksFull,
  } = task ?? {};
  const { fileCount } = taskFiles ?? {};

  const isDisplayTask = executionTasksFull != null;
  const { showBuildBaron } = useBuildBaronVariables({
    hasAnnotation: !!annotation,
    canModifyAnnotation,
    task: { id, execution, status },
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
        <TestsTable />
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
        <FilesTables />
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

  useEffect(() => {
    const query = parseQueryString(location.search);
    const newRoute = getTaskRoute(id, {
      tab: activeTabs[selectedTab],
      ...query,
    });
    history.replace(newRoute);
    if (previousTab !== undefined && previousTab !== selectedTab) {
      taskAnalytics.sendEvent({
        name: "Change Tab",
        tab: activeTabs[selectedTab],
      });
    }
  }, [selectedTab, execution]); // eslint-disable-line react-hooks/exhaustive-deps

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
