import React from "react";
import { useParams } from "react-router-dom";
import { usePatchAnalytics } from "analytics";
import { TasksTable } from "components/Table/TasksTable";
import { Task, PatchTasksQuery, SortOrder } from "gql/generated/types";
import {
  useTaskStatuses,
  useUpdateURLQueryParams,
  useStatusesFilter,
} from "hooks";
import { PatchTasksQueryParams, TableOnChange } from "types/task";
import { queryString } from "utils";

const { toSortString } = queryString;

interface Props {
  patchTasks: PatchTasksQuery["patchTasks"];
  sorts: SortOrder[];
}

export const PatchTasksTable: React.FC<Props> = ({ patchTasks, sorts }) => {
  const { id: versionId } = useParams<{ id: string }>();
  const updateQueryParams = useUpdateURLQueryParams();
  const patchAnalytics = usePatchAnalytics();
  const sendFilterTasksEvent = (filterBy: string) =>
    patchAnalytics.sendEvent({ name: "Filter Tasks", filterBy });
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
  const tableChangeHandler: TableOnChange<Task> = (...[, , sorter]) => {
    updateQueryParams({
      sorts: toSortString(sorter),
      [PatchTasksQueryParams.Page]: "0",
    });
  };
  const { currentStatuses, baseStatuses } = useTaskStatuses({ versionId });
  const statusSelectorProps = {
    state: selectedStatuses,
    tData: currentStatuses,
    onChange: onChangeStatusFilter,
    onReset: () => null,
    onFilter: () => null,
  };
  const baseStatusSelectorProps = {
    state: selectedBaseStatuses,
    tData: baseStatuses,
    onChange: onChangeBaseStatusFilter,
  };
  return (
    <TasksTable
      sorts={sorts}
      tableChangeHandler={tableChangeHandler}
      tasks={patchTasks?.tasks}
      onExpand={(expanded) => {
        patchAnalytics.sendEvent({
          name: "Toggle Display Task Dropdown",
          expanded,
        });
      }}
      onClickTaskLink={(taskId) =>
        patchAnalytics.sendEvent({
          name: "Click Task Table Link",
          taskId,
        })
      }
      baseStatusSelectorProps={baseStatusSelectorProps}
      statusSelectorProps={statusSelectorProps}
    />
  );
};
