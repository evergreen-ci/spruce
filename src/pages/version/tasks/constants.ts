import { TaskSortCategory } from "gql/generated/types";
import { PatchTasksQueryParams } from "types/task";

const mapFilterParamToId = {
  [PatchTasksQueryParams.TaskName]: TaskSortCategory.Name,
  [PatchTasksQueryParams.Statuses]: TaskSortCategory.Status,
  [PatchTasksQueryParams.BaseStatuses]: TaskSortCategory.BaseStatus,
  [PatchTasksQueryParams.Variant]: TaskSortCategory.Variant,
} as const;

const mapIdToFilterParam = {
  [TaskSortCategory.Name]: PatchTasksQueryParams.TaskName,
  [TaskSortCategory.Status]: PatchTasksQueryParams.Statuses,
  [TaskSortCategory.BaseStatus]: PatchTasksQueryParams.BaseStatuses,
  [TaskSortCategory.Variant]: PatchTasksQueryParams.Variant,
};

const emptyFilterQueryParams = {
  [PatchTasksQueryParams.TaskName]: undefined,
  [PatchTasksQueryParams.Statuses]: undefined,
  [PatchTasksQueryParams.BaseStatuses]: undefined,
  [PatchTasksQueryParams.Variant]: undefined,
};

export { mapFilterParamToId, mapIdToFilterParam, emptyFilterQueryParams };
