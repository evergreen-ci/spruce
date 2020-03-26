import React from "react";
import { useFilterInputChangeHandler, useStatusesFilter } from "hooks";
import Icon from "@leafygreen-ui/icon";
import { FiltersWrapper, StyledInput } from "components/styles";
import { PatchTasksQueryParams, TaskStatus } from "types/task";
import { TreeSelect } from "components/TreeSelect";

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

  return (
    <FiltersWrapper>
      <StyledInput
        data-cy="task-name-input"
        placeholder="Search Task Name"
        suffix={<Icon glyph="MagnifyingGlass" />}
        value={taskNameFilterValue}
        onChange={taskNameFilterValueOnChange}
      />
      <StyledInput
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
        inputLabel={`Test Status: ${statusesVal}`}
        id="cy-test-status-select"
      />
    </FiltersWrapper>
  );
};

const statusesTreeData = [
  {
    title: "All",
    value: TaskStatus.All,
    key: TaskStatus.All
  },
  {
    title: "Failed",
    value: "all failures",
    key: "all failures",
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
    title: "Succeeded",
    value: TaskStatus.Succeeded,
    key: TaskStatus.Succeeded
  },
  {
    title: "Started",
    value: TaskStatus.Started,
    key: TaskStatus.Started
  },
  {
    title: "Scheduled",
    value: TaskStatus.Dispatched,
    key: TaskStatus.Dispatched
  },
  {
    title: "Not Scheduled",
    value: "not started",
    key: "not started",
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
    value: "system issues",
    key: "system issues",
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
    title: "Pending",
    value: TaskStatus.StatusPending,
    key: TaskStatus.StatusPending
  }
];
