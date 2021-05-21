import { FilterOutlined, SearchOutlined } from "@ant-design/icons";
import { useQuery } from "@apollo/client";
import Icon from "@leafygreen-ui/icon";
import { uiColors } from "@leafygreen-ui/palette";
import { Input } from "antd";
import { useParams } from "react-router-dom";
import { usePatchAnalytics } from "analytics";
import { Button } from "components/Button";
import {
  FilterWrapper,
  ButtonsWrapper,
  ButtonWrapper,
} from "components/styles/Table";
import { getColumnSearchFilterProps } from "components/Table/Filters";
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
    _, // eslint-disable-line
    onChangeVariantName,
    submitVariantName,
    resetVariantName,
  ] = useFilterInputChangeHandler(
    PatchTasksQueryParams.Variant,
    true,
    sendFilterTasksEvent
  );
  const [
    taskNameFilterValue,
    __, // eslint-disable-line
    onChangeTaskName,
    submitTaskName,
    resetTaskName,
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
        <FilterWrapper>
          <Input
            data-cy="task-name-filter-dropdown"
            placeholder="Search Task Name"
            suffix={<Icon glyph="MagnifyingGlass" />}
            value={taskNameFilterValue}
            onChange={onChangeTaskName}
            onPressEnter={submitTaskName}
          />
          <ButtonsWrapper>
            <ButtonWrapper>
              <Button
                data-cy="reset-button"
                onClick={resetTaskName}
                size="small"
              >
                Reset
              </Button>
            </ButtonWrapper>
            <Button
              data-cy="filter-button"
              size="small"
              variant="primary"
              onClick={submitTaskName}
            >
              Search
            </Button>
          </ButtonsWrapper>
        </FilterWrapper>
      ),
      filterIcon: (
        <SearchOutlined
          data-cy="task-name-filter-icon"
          style={getStyle(taskNameFilterValue)}
        />
      ),
    },
    variant: getColumnSearchFilterProps({
      dataCy: "variant-name",
      placeholder: "Variant name",
      value: variantFilterValue,
      updateUrlParam: submitVariantName,
      resetUrlParam: resetVariantName,
      onChange: onChangeVariantName,
    }),
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
