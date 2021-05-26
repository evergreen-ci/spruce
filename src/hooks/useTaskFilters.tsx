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
import {
  getColumnSearchFilterProps,
  getColumnTreeSelectProps,
} from "components/Table/Filters";
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
    ,
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
    ,
    onChangeTaskName,
    submitTaskName,
    resetTaskName,
  ] = useFilterInputChangeHandler(
    PatchTasksQueryParams.TaskName,
    true,
    sendFilterTasksEvent
  );

  // statuses
  const [
    selectedStatuses,
    ,
    updateStatuses,
    submitStatuses,
    resetStatuses,
  ] = useStatusesFilter(
    PatchTasksQueryParams.Statuses,
    true,
    sendFilterTasksEvent
  );

  // base statuses
  const [
    selectedBaseStatuses,
    ,
    updateBaseStatuses,
    submitBaseStatuses,
    resetBaseStatuses,
  ] = useStatusesFilter(
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
    name: getColumnSearchFilterProps({
      dataCy: "task-name",
      placeholder: "Task name",
      value: taskNameFilterValue,
      updateUrlParam: submitTaskName,
      resetUrlParam: resetTaskName,
      onChange: onChangeTaskName,
    }),
    variant: getColumnSearchFilterProps({
      dataCy: "variant-name",
      placeholder: "Variant name",
      value: variantFilterValue,
      updateUrlParam: submitVariantName,
      resetUrlParam: resetVariantName,
      onChange: onChangeVariantName,
    }),
    baseStatus: getColumnTreeSelectProps({
      dataCy: "base-status",
      statuses: selectedBaseStatuses,
      tData: getCurrentStatuses(baseStatuses, taskStatusesFilterTreeData),
      label: "Task Base Status",
      onChange: updateBaseStatuses,
      onSubmit: submitBaseStatuses,
      onReset: resetBaseStatuses,
    }),
    status: getColumnTreeSelectProps({
      dataCy: "status",
      statuses: selectedStatuses,
      tData: getCurrentStatuses(statuses, taskStatusesFilterTreeData),
      label: "Task Status",
      onChange: updateStatuses,
      onSubmit: submitStatuses,
      onReset: resetStatuses,
    }),
  };
};

const getStyle = (value: string[] | string) =>
  value.length ? { color: uiColors.blue.base } : {};
