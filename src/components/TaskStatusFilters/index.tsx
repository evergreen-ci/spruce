import React from "react";
import { useQuery } from "@apollo/client";
import { Dropdown, TreeSelect, TreeDataEntry } from "components/TreeSelect";
import { pollInterval } from "constants/index";
import { taskStatusesFilterTreeData } from "constants/task";
import {
  GetTaskStatusesQuery,
  GetTaskStatusesQueryVariables,
} from "gql/generated/types";
import { GET_TASK_STATUSES } from "gql/queries";
import { useNetworkStatus } from "hooks";
import { getCurrentStatuses } from "./getCurrentStatuses";

interface Props {
  versionId: string;
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
  versionId,
  selectedBaseStatuses,
  selectedStatuses,
  filterWidth = "25%",
  options = taskStatusesFilterTreeData,
}) => {
  const { data, startPolling, stopPolling } = useQuery<
    GetTaskStatusesQuery,
    GetTaskStatusesQueryVariables
  >(GET_TASK_STATUSES, { variables: { id: versionId }, pollInterval });

  useNetworkStatus(startPolling, stopPolling);

  const { version } = data || {};
  const { taskStatuses, baseTaskStatuses } = version || {};
  const statuses = taskStatuses ?? [];
  const baseStatuses = baseTaskStatuses ?? [];

  return (
    <>
      <Dropdown
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
      <Dropdown
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
