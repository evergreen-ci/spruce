import React from "react";
import { useFilterInputChangeHandler, useStatusesFilter } from "hooks";
import Icon from "@leafygreen-ui/icon";
import { TaskSortBy } from "gql/queries/get-patch-tasks";
import { FiltersWrapper, StyledInput } from "components/styles";
import { PatchTasksQueryParams, TaskStatus } from "types/task";
import { TreeSelect } from "components/TreeSelect";

export const TaskFilters: React.FC = () => {
  const [
    variantFilterValue,
    variantFilterValueOnChange
  ] = useFilterInputChangeHandler(TaskSortBy.Variant);
  const [statusesValue, statusesOnChange] = useStatusesFilter(
    PatchTasksQueryParams.Statuses
  );

  return (
    <FiltersWrapper>
      <StyledInput
        placeholder="Search Variant Name"
        onChange={variantFilterValueOnChange}
        suffix={<Icon glyph="MagnifyingGlass" />}
        value={variantFilterValue}
        data-cy="variant-input"
      />
      <TreeSelect
        onChange={statusesOnChange}
        state={statusesValue}
        tData={statusesTreeData}
        inputLabel={`Test Status: ${statusesValue}`}
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
    title: "Unstarted",
    value: TaskStatus.Unstarted,
    key: TaskStatus.Unstarted
  },
  {
    title: "Undispatched",
    value: TaskStatus.Undispatched,
    key: TaskStatus.Undispatched
  },
  {
    title: "Started",
    value: TaskStatus.Started,
    key: TaskStatus.Started
  },
  {
    title: "Dispatched",
    value: TaskStatus.Dispatched,
    key: TaskStatus.Dispatched
  },
  {
    title: "Succeeded",
    value: TaskStatus.Succeeded,
    key: TaskStatus.Succeeded
  },
  {
    title: "Failed",
    value: TaskStatus.Failed,
    key: TaskStatus.Failed
  },
  {
    title: "System Failed",
    value: TaskStatus.SystemFailed,
    key: TaskStatus.SystemFailed
  },
  {
    title: "Test Timed Out",
    value: TaskStatus.TestTimedOut,
    key: TaskStatus.TestTimedOut
  },
  {
    title: "Setup Failed",
    value: TaskStatus.SetupFailed,
    key: TaskStatus.SetupFailed
  },
  {
    title: "Status Blocked",
    value: TaskStatus.StatusBlocked,
    key: TaskStatus.StatusBlocked
  },
  {
    title: "Status Pending",
    value: TaskStatus.StatusPending,
    key: TaskStatus.StatusPending
  }
];
