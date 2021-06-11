import { useQuery } from "@apollo/client";
import styled from "@emotion/styled";
import Icon from "@leafygreen-ui/icon";
import { Input } from "antd";
import { useParams } from "react-router-dom";
import { usePatchAnalytics } from "analytics";
import { getCurrentStatuses } from "components/TaskStatusFilters/getCurrentStatuses";
import { TreeSelect } from "components/TreeSelect";
import { pollInterval } from "constants/index";
import { taskStatusesFilterTreeData } from "constants/task";
import {
  GetPatchTaskStatusesQuery,
  GetPatchTaskStatusesQueryVariables,
} from "gql/generated/types";
import { GET_PATCH_TASK_STATUSES } from "gql/queries";
import {
  useNetworkStatus,
  useFilterInputChangeHandler,
  useStatusesFilter,
} from "hooks";

import { PatchTasksQueryParams } from "types/task";

export const TaskFilters: React.FC = () => {
  const patchAnalytics = usePatchAnalytics();
  const sendFilterTasksEvent = (filterBy: string) =>
    patchAnalytics.sendEvent({ name: "Filter Tasks", filterBy });

  // top status
  const [selectedStatuses, onChangeStatusFilter] = useStatusesFilter(
    PatchTasksQueryParams.Statuses,
    true,
    sendFilterTasksEvent
  );

  // base status
  const [selectedBaseStatuses, onChangeBaseStatusFilter] = useStatusesFilter(
    PatchTasksQueryParams.BaseStatuses,
    true,
    sendFilterTasksEvent
  );

  // variant name
  const [
    variantFilterValue,
    variantFilterValueOnChange,
  ] = useFilterInputChangeHandler(
    PatchTasksQueryParams.Variant,
    true,
    sendFilterTasksEvent
  );

  // task name
  const [
    taskNameFilterValue,
    taskNameFilterValueOnChange,
  ] = useFilterInputChangeHandler(
    PatchTasksQueryParams.TaskName,
    true,
    sendFilterTasksEvent
  );

  const { id: patchId } = useParams<{ id: string }>();

  const { data, startPolling, stopPolling } = useQuery<
    GetPatchTaskStatusesQuery,
    GetPatchTaskStatusesQueryVariables
  >(GET_PATCH_TASK_STATUSES, { variables: { id: patchId }, pollInterval });

  useNetworkStatus(startPolling, stopPolling);

  const statuses = data?.patch.taskStatuses ?? [];
  const baseStatuses = data?.patch.baseTaskStatuses ?? [];

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
        state={selectedStatuses}
        tData={getCurrentStatuses(statuses, taskStatusesFilterTreeData)}
        inputLabel="Task Status: "
        data-cy="task-status-filter"
        width="25%"
        onChange={onChangeStatusFilter}
      />
      <TreeSelect
        state={selectedBaseStatuses}
        tData={getCurrentStatuses(baseStatuses, taskStatusesFilterTreeData)}
        inputLabel="Task Base Status: "
        data-cy="task-base-status-filter"
        width="25%"
        onChange={onChangeBaseStatusFilter}
      />
    </FiltersWrapper>
  );
};

const FiltersWrapper = styled.div`
  display: flex;
  margin-bottom: 12px;
  > :not(:last-child) {
    margin-right: 20px;
  }
`;
