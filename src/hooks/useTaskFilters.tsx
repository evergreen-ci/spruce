import { FilterOutlined, SearchOutlined } from "@ant-design/icons";
import { useQuery } from "@apollo/client";
import Icon from "@leafygreen-ui/icon";
import { uiColors } from "@leafygreen-ui/palette";
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

type DropdownAndIcon = {
  filterDropdown: JSX.Element;
  filterIcon: JSX.Element;
};

export interface TaskFilters {
  name: DropdownAndIcon;
  variant: DropdownAndIcon;
  status: DropdownAndIcon;
  baseStatus: DropdownAndIcon;
}

export const useTaskFilters: () => TaskFilters = () => {
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
  const [selectedStatuses, onChangeStatusFilter] = useStatusesFilter(
    PatchTasksQueryParams.Statuses,
    true,
    sendFilterTasksEvent
  );
  const [selectedBaseStatuses, onChangeBaseStatusFilter] = useStatusesFilter(
    PatchTasksQueryParams.BaseStatuses,
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

  return {
    name: {
      filterDropdown: (
        <Input
          data-cy="task-name-filter-dropdown"
          placeholder="Search Task Name"
          suffix={<Icon glyph="MagnifyingGlass" />}
          value={taskNameFilterValue}
          onChange={taskNameFilterValueOnChange}
        />
      ),
      filterIcon: (
        <SearchOutlined
          data-cy="task-name-filter-icon"
          style={getStyle(taskNameFilterValue)}
        />
      ),
    },
    variant: {
      filterDropdown: (
        <Input
          data-cy="variant-filter-dropdown"
          placeholder="Search Variant Name"
          suffix={<Icon glyph="MagnifyingGlass" />}
          value={variantFilterValue}
          onChange={variantFilterValueOnChange}
        />
      ),
      filterIcon: (
        <SearchOutlined
          data-cy="variant-filter-icon"
          style={getStyle(variantFilterValue)}
        />
      ),
    },
    baseStatus: {
      filterDropdown: (
        <TreeSelect
          state={selectedBaseStatuses}
          tData={getCurrentStatuses(baseStatuses, taskStatusesFilterTreeData)}
          inputLabel="Task Base Status: "
          data-cy="task-base-status-filter"
          onChange={onChangeBaseStatusFilter}
        />
      ),
      filterIcon: (
        <FilterOutlined
          data-cy="task-name-filter-icon"
          style={getStyle(selectedBaseStatuses)}
        />
      ),
    },
    status: {
      filterDropdown: (
        <TreeSelect
          state={selectedStatuses}
          tData={getCurrentStatuses(statuses, taskStatusesFilterTreeData)}
          inputLabel="Task Status: "
          data-cy="task-status-filter"
          onChange={onChangeStatusFilter}
        />
      ),
      filterIcon: (
        <FilterOutlined
          data-cy="task-name-filter-icon"
          style={getStyle(selectedBaseStatuses)}
        />
      ),
    },
  };
};

const getStyle = (value: string[] | string) =>
  value.length ? { color: uiColors.blue.base } : {};
