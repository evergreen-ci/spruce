import React from "react";
import {
  useFilterInputChangeHandler,
  useStatusesFilter,
  usePollMonitor,
} from "hooks";
import Icon from "@leafygreen-ui/icon";
import { PatchTasksQueryParams, TaskStatus } from "types/task";
import { TreeSelect } from "components/TreeSelect";
import { Input } from "antd";
import styled from "@emotion/styled";
import { useParams } from "react-router-dom";
import { useQuery } from "@apollo/react-hooks";
import { GET_PATCH_TASK_STATUSES } from "gql/queries";
import {
  GetPatchTaskStatusesQuery,
  GetPatchTaskStatusesQueryVariables,
} from "gql/generated/types";
import get from "lodash/get";
import { getCurrentStatuses } from "utils/statuses/getCurrentStatuses";
import { usePatchAnalytics } from "analytics";
import { pollInterval } from "constants/index";

export const TaskFilters: React.FC = () => {
  const patchAnalytics = usePatchAnalytics();
  const sendFilterTasksEvent = (filterBy: string) =>
    patchAnalytics.sendEvent({ name: "Filter Tasks", filterBy });

  const [
    variantFilterValue,
    variantFilterValueOnChange,
  ] = useFilterInputChangeHandler(
    PatchTasksQueryParams.Variant,
    true,
    sendFilterTasksEvent
  );
  const [
    taskNameFilterValue,
    taskNameFilterValueOnChange,
  ] = useFilterInputChangeHandler(
    PatchTasksQueryParams.TaskName,
    true,
    sendFilterTasksEvent
  );
  const [statusesVal, statusesValOnChange] = useStatusesFilter(
    PatchTasksQueryParams.Statuses,
    true,
    sendFilterTasksEvent
  );
  const [baseStatusesVal, baseStatusesValOnChange] = useStatusesFilter(
    PatchTasksQueryParams.BaseStatuses,
    true,
    sendFilterTasksEvent
  );

  // fetch and poll patch's task statuses so statuses filters only show statuses relevant to the patch
  const { id } = useParams<{ id: string }>();
  const { data, startPolling, stopPolling } = useQuery<
    GetPatchTaskStatusesQuery,
    GetPatchTaskStatusesQueryVariables
  >(GET_PATCH_TASK_STATUSES, { variables: { id }, pollInterval });
  usePollMonitor(startPolling, stopPolling);
  const statuses = get(data, "patch.taskStatuses", []);
  const baseStatuses = get(data, "patch.baseTaskStatuses", []);

  return (
    <FiltersWrapper>
      <Input
        style={{ width: "25%" }}
        data-cy="task-name-input"
        placeholder="Search Task Name"
        suffix={<Icon glyph="MagnifyingGlass" />}
        value={taskNameFilterValue}
        onChange={taskNameFilterValueOnChange}
      />
      <Input
        style={{ width: "25%" }}
        data-cy="variant-input"
        placeholder="Search Variant Name"
        suffix={<Icon glyph="MagnifyingGlass" />}
        value={variantFilterValue}
        onChange={variantFilterValueOnChange}
      />
      <TreeSelect
        state={statusesVal}
        tData={getCurrentStatuses(statuses, statusesTreeData)}
        inputLabel="Task Status: "
        dataCy="task-status-filter"
        width="25%"
        onChange={statusesValOnChange}
      />
      <TreeSelect
        state={baseStatusesVal}
        tData={getCurrentStatuses(baseStatuses, statusesTreeData)}
        inputLabel="Task Base Status: "
        dataCy="task-base-status-filter"
        width="25%"
        onChange={baseStatusesValOnChange}
      />
    </FiltersWrapper>
  );
};

const allKey = "all";

export interface Status {
  title: string;
  value: string;
  key: string;
  children?: Status[];
}

const statusesTreeData: Status[] = [
  {
    title: "All",
    value: allKey,
    key: allKey,
  },
  {
    title: "Failures",
    value: "all-failures",
    key: "all-failures",
    children: [
      {
        title: "Failed",
        value: TaskStatus.Failed,
        key: TaskStatus.Failed,
      },
      {
        title: "Task Timed Out",
        value: TaskStatus.TaskTimedOut,
        key: TaskStatus.TaskTimedOut,
      },
      {
        title: "Test Timed Out",
        value: TaskStatus.TestTimedOut,
        key: TaskStatus.TestTimedOut,
      },
    ],
  },
  {
    title: "Success",
    value: TaskStatus.Succeeded,
    key: TaskStatus.Succeeded,
  },
  {
    title: "Running",
    value: TaskStatus.Dispatched,
    key: TaskStatus.Dispatched,
  },
  {
    title: "Started",
    value: TaskStatus.Started,
    key: TaskStatus.Started,
  },
  {
    title: "Scheduled",
    value: "scheduled",
    key: "scheduled",
    children: [
      {
        title: "Unstarted",
        value: TaskStatus.Unstarted,
        key: TaskStatus.Unstarted,
      },
      {
        title: "Undispatched",
        value: TaskStatus.Undispatched,
        key: TaskStatus.Undispatched,
      },
    ],
  },
  {
    title: "System Issues",
    value: "system-issues",
    key: "system-issues",
    children: [
      {
        title: "System Failed",
        value: TaskStatus.SystemFailed,
        key: TaskStatus.SystemFailed,
      },
      {
        title: "System Timed Out",
        value: TaskStatus.SystemTimedOut,
        key: TaskStatus.SystemTimedOut,
      },
      {
        title: "System Unresponsive",
        value: TaskStatus.SystemUnresponsive,
        key: TaskStatus.SystemUnresponsive,
      },
    ],
  },
  {
    title: "Setup Failed",
    value: TaskStatus.SetupFailed,
    key: TaskStatus.SetupFailed,
  },
  {
    title: "Blocked",
    value: TaskStatus.StatusBlocked,
    key: TaskStatus.StatusBlocked,
  },
  {
    title: "Won't Run",
    value: TaskStatus.Inactive,
    key: TaskStatus.Inactive,
  },
];

const FiltersWrapper = styled.div`
  display: flex;
  margin-bottom: 12px;
  > :not(:last-child) {
    margin-right: 20px;
  }
`;
