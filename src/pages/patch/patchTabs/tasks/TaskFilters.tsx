import React from "react";
import { useFilterInputChangeHandler, useStatusesFilter } from "hooks";
import Icon from "@leafygreen-ui/icon";
import { PatchTasksQueryParams, TaskStatus } from "types/task";
import { TreeSelect } from "components/TreeSelect";
import { Input } from "antd";
import styled from "@emotion/styled";

export const TaskFilters: React.FC = () => {
  const [
    variantFilterValue,
    variantFilterValueOnChange
  ] = useFilterInputChangeHandler(PatchTasksQueryParams.Variant);
  const [
    taskNameFilterValue,
    taskNameFilterValueOnChange
  ] = useFilterInputChangeHandler(PatchTasksQueryParams.TaskName);
  const [statusesVal, statusesValOnChange] = useStatusesFilter(
    PatchTasksQueryParams.Statuses
  );
  const [baseStatusesVal, baseStatusesValOnChange] = useStatusesFilter(
    PatchTasksQueryParams.BaseStatuses
  );

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
        onChange={statusesValOnChange}
        state={statusesVal}
        tData={statusesTreeData}
        inputLabel="Task Status: "
        dataCy="task-status-filter"
        width="25%"
      />
      <TreeSelect
        onChange={baseStatusesValOnChange}
        state={baseStatusesVal}
        tData={statusesTreeData}
        inputLabel="Task Base Status: "
        dataCy="task-base-status-filter"
        width="25%"
      />
    </FiltersWrapper>
  );
};

const statusesTreeData = [
  {
    title: "All",
    value: "all",
    key: "all"
  },
  {
    title: "Failures",
    value: "all-failures",
    key: "all-failures",
    children: [
      {
        title: "Failed",
        value: TaskStatus.Failed,
        key: TaskStatus.Failed
      },
      {
        title: "Test Timed Out",
        value: TaskStatus.TestTimedOut,
        key: TaskStatus.TestTimedOut
      }
    ]
  },
  {
    title: "Success",
    value: TaskStatus.Succeeded,
    key: TaskStatus.Succeeded
  },
  {
    title: "Running",
    value: TaskStatus.Dispatched,
    key: TaskStatus.Dispatched
  },
  {
    title: "Started",
    value: TaskStatus.Started,
    key: TaskStatus.Started
  },
  {
    title: "Scheduled",
    value: "scheduled",
    key: "scheduled",
    children: [
      {
        title: "Unstarted",
        value: TaskStatus.Unstarted,
        key: TaskStatus.Unstarted
      },
      {
        title: "Undispatched",
        value: TaskStatus.Undispatched,
        key: TaskStatus.Undispatched
      }
    ]
  },
  {
    title: "System Issues",
    value: "system-issues",
    key: "system-issues",
    children: [
      {
        title: "System Failed",
        value: TaskStatus.SystemFailed,
        key: TaskStatus.SystemFailed
      }
    ]
  },
  {
    title: "Setup Failed",
    value: TaskStatus.SetupFailed,
    key: TaskStatus.SetupFailed
  },
  {
    title: "Blocked",
    value: TaskStatus.StatusBlocked,
    key: TaskStatus.StatusBlocked
  },
  {
    title: "Won't Run",
    value: TaskStatus.Inactive,
    key: TaskStatus.Inactive
  }
];

const FiltersWrapper = styled.div`
  display: flex;
  margin-bottom: 12px;
  > :not(:last-child) {
    margin-right: 20px;
  }
`;
