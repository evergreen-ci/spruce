import React from "react";
import { useQuery } from "@apollo/client";
import { TreeSelect, TreeDataEntry } from "components/TreeSelect";
import { TreeSelectDropdown } from "components/TreeSelectDropdown";
import { pollInterval } from "constants/index";
import { taskStatusesFilterTreeData } from "constants/task";
import {
  GetPatchTaskStatusesQuery,
  GetPatchTaskStatusesQueryVariables,
} from "gql/generated/types";
import { GET_PATCH_TASK_STATUSES } from "gql/queries";
import { useNetworkStatus } from "hooks";
import { getCurrentStatuses } from "./getCurrentStatuses";

interface Props {
  patchId: string;
  selectedStatuses: string[];
  selectedBaseStatuses: string[];
  onChangeStatusFilter: (s: string[]) => void;
  onChangeBaseStatusFilter: (s: string[]) => void;
  options?: TreeDataEntry[];
  filterWidth?: string;
}

export const TaskStatusFilters: React.FC<Props> = ({
  onChangeBaseStatusFilter,
  onChangeStatusFilter,
  patchId,
  selectedBaseStatuses,
  selectedStatuses,
  filterWidth = "25%",
  options = taskStatusesFilterTreeData,
}) => {
  const { data, startPolling, stopPolling } = useQuery<
    GetPatchTaskStatusesQuery,
    GetPatchTaskStatusesQueryVariables
  >(GET_PATCH_TASK_STATUSES, { variables: { id: patchId }, pollInterval });

  useNetworkStatus(startPolling, stopPolling);

  const statuses = data?.patch.taskStatuses ?? [];
  const baseStatuses = data?.patch.baseTaskStatuses ?? [];

  return (
    <>
      <TreeSelectDropdown
        data-cy="task-status-filter"
        inputLabel="Task Status: "
        width={filterWidth}
        render={({ getDropdownProps }) => (
          <TreeSelect
            {...getDropdownProps()}
            state={selectedStatuses}
            tData={getCurrentStatuses(statuses, options)}
            onChange={onChangeStatusFilter}
          />
        )}
      />
      <TreeSelectDropdown
        data-cy="task-base-status-filter"
        inputLabel="Task Base Status: "
        width={filterWidth}
        render={({ getDropdownProps }) => (
          <TreeSelect
            {...getDropdownProps()}
            state={selectedBaseStatuses}
            tData={getCurrentStatuses(baseStatuses, options)}
            onChange={onChangeBaseStatusFilter}
          />
        )}
      />
    </>
  );
};
