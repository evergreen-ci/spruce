import React from "react";
import { useParams } from "react-router-dom";
import { useVersionAnalytics } from "analytics";
import { InputFilterProps } from "components/Table/Filters";
import { TasksTable } from "components/Table/TasksTable";
import { Task, PatchTasksQuery, SortOrder } from "gql/generated/types";
import {
  useTaskStatuses,
  useUpdateURLQueryParams,
  useStatusesFilter,
  useFilterInputChangeHandler,
} from "hooks";
import { PatchTasksQueryParams, TableOnChange } from "types/task";
import { queryString } from "utils";

const { toSortString } = queryString;

interface Props {
  patchTasks: PatchTasksQuery["patchTasks"];
  sorts: SortOrder[];
}

export const PatchTasksTable: React.VFC<Props> = ({ patchTasks, sorts }) => {
  const { id: versionId } = useParams<{ id: string }>();
  const updateQueryParams = useUpdateURLQueryParams();
  const { sendEvent } = useVersionAnalytics(versionId);
  const filterHookProps = {
    resetPage: true,
    sendAnalyticsEvent: (filterBy: string) =>
      sendEvent({ name: "Filter Tasks", filterBy }),
  };
  const currentStatusesFilter = useStatusesFilter({
    urlParam: PatchTasksQueryParams.Statuses,
    ...filterHookProps,
  });
  const baseStatusesFilter = useStatusesFilter({
    urlParam: PatchTasksQueryParams.BaseStatuses,
    ...filterHookProps,
  });
  const { currentStatuses, baseStatuses } = useTaskStatuses({ versionId });
  const statusSelectorProps = {
    state: currentStatusesFilter.inputValue,
    tData: currentStatuses,
    onChange: currentStatusesFilter.setAndSubmitInputValue,
  };
  const baseStatusSelectorProps = {
    state: baseStatusesFilter.inputValue,
    tData: baseStatuses,
    onChange: baseStatusesFilter.setAndSubmitInputValue,
  };
  const variantFilterInputChangeHandler = useFilterInputChangeHandler({
    urlParam: PatchTasksQueryParams.Variant,
    ...filterHookProps,
  });
  const taskNameFilterInputChangeHandler = useFilterInputChangeHandler({
    urlParam: PatchTasksQueryParams.TaskName,
    ...filterHookProps,
  });

  const tableChangeHandler: TableOnChange<Task> = (...[, , sorter]) => {
    updateQueryParams({
      sorts: toSortString(sorter),
      [PatchTasksQueryParams.Page]: "0",
    });
  };

  const variantInputProps: InputFilterProps = {
    placeholder: "Variant name regex",
    value: variantFilterInputChangeHandler.inputValue,
    onChange: ({ target }) =>
      variantFilterInputChangeHandler.setInputValue(target.value),
    onFilter: variantFilterInputChangeHandler.submitInputValue,
  };

  const taskNameInputProps: InputFilterProps = {
    placeholder: "Task name regex",
    value: taskNameFilterInputChangeHandler.inputValue,
    onChange: ({ target }) =>
      taskNameFilterInputChangeHandler.setInputValue(target.value),
    onFilter: taskNameFilterInputChangeHandler.submitInputValue,
  };

  return (
    <TasksTable
      sorts={sorts}
      tableChangeHandler={tableChangeHandler}
      tasks={patchTasks?.tasks}
      onExpand={(expanded) => {
        sendEvent({
          name: "Toggle Display Task Dropdown",
          expanded,
        });
      }}
      onClickTaskLink={(taskId) =>
        sendEvent({
          name: "Click Task Table Link",
          taskId,
        })
      }
      onColumnHeaderClick={(sortField) =>
        sendEvent({
          name: "Sort Tasks Table",
          sortBy: sortField,
        })
      }
      taskNameInputProps={taskNameInputProps}
      variantInputProps={variantInputProps}
      baseStatusSelectorProps={baseStatusSelectorProps}
      statusSelectorProps={statusSelectorProps}
    />
  );
};
