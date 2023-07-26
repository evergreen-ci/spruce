import { useParams } from "react-router-dom";
import { useVersionAnalytics } from "analytics";
import { InputFilterProps } from "components/Table/Filters";
import TasksTable from "components/TasksTable";
import { Task, VersionTasksQuery, SortOrder } from "gql/generated/types";
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
  isPatch: boolean;
  tasks: VersionTasksQuery["version"]["tasks"]["data"];
  sorts: SortOrder[];
  loading: boolean;
}

export const PatchTasksTable: React.VFC<Props> = ({
  isPatch,
  loading,
  sorts,
  tasks,
}) => {
  const { id: versionId } = useParams<{ id: string }>();
  const updateQueryParams = useUpdateURLQueryParams();
  const { sendEvent } = useVersionAnalytics(versionId);
  const filterHookProps = {
    resetPage: true,
    sendAnalyticsEvent: (filterBy: string) =>
      sendEvent({ filterBy, name: "Filter Tasks" }),
  };
  const currentStatusesFilter = useStatusesFilter({
    urlParam: PatchTasksQueryParams.Statuses,
    ...filterHookProps,
  });
  const baseStatusesFilter = useStatusesFilter({
    urlParam: PatchTasksQueryParams.BaseStatuses,
    ...filterHookProps,
  });
  const { baseStatuses, currentStatuses } = useTaskStatuses({ versionId });
  const statusSelectorProps = {
    onChange: currentStatusesFilter.setAndSubmitInputValue,
    state: currentStatusesFilter.inputValue,
    tData: currentStatuses,
  };
  const baseStatusSelectorProps = {
    onChange: baseStatusesFilter.setAndSubmitInputValue,
    state: baseStatusesFilter.inputValue,
    tData: baseStatuses,
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
    onChange: ({ target }) =>
      variantFilterInputChangeHandler.setInputValue(target.value),
    onFilter: variantFilterInputChangeHandler.submitInputValue,
    placeholder: "Variant name regex",
    value: variantFilterInputChangeHandler.inputValue,
  };

  const taskNameInputProps: InputFilterProps = {
    onChange: ({ target }) =>
      taskNameFilterInputChangeHandler.setInputValue(target.value),
    onFilter: taskNameFilterInputChangeHandler.submitInputValue,
    placeholder: "Task name regex",
    value: taskNameFilterInputChangeHandler.inputValue,
  };

  return (
    <TasksTable
      isPatch={isPatch}
      sorts={sorts}
      tableChangeHandler={tableChangeHandler}
      tasks={tasks}
      loading={loading}
      onExpand={(expanded) => {
        sendEvent({
          expanded,
          name: "Toggle Display Task Dropdown",
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
