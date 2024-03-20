import { useRef, useMemo } from "react";
import { LeafyGreenTable, useLeafyGreenTable } from "@leafygreen-ui/table";
import {
  ColumnFiltersState,
  Filters,
  Sorting,
  SortingState,
} from "@tanstack/react-table";
import { useParams } from "react-router-dom";
import { usePatchAnalytics, useVersionAnalytics } from "analytics";
import { BaseTable } from "components/Table/BaseTable";
import TableControl from "components/Table/TableControl";
import { TablePlaceholder } from "components/Table/TablePlaceholder";
import TableWrapper from "components/Table/TableWrapper";
import { onChangeHandler } from "components/Table/utils";
import { getColumnsTemplate } from "components/TasksTable/Columns";
import { TaskTableInfo } from "components/TasksTable/types";
import { SortDirection, TaskSortCategory } from "gql/generated/types";
import { useTaskStatuses } from "hooks";
import { Action } from "./reducer";

const { getDefaultOptions: getDefaultFiltering } = Filters;
const { getDefaultOptions: getDefaultSorting } = Sorting;

interface DownstreamTasksTableProps {
  childPatchId: string;
  count: number;
  dispatch: (action: Action) => void;
  isPatch: boolean;
  limit: number;
  loading: boolean;
  page: number;
  taskCount: number;
  tasks: TaskTableInfo[];
}

export const DownstreamTasksTable: React.FC<DownstreamTasksTableProps> = ({
  childPatchId,
  count,
  dispatch,
  isPatch,
  limit,
  loading,
  page,
  taskCount,
  tasks,
}) => {
  const { id: versionId } = useParams<{ id: string }>();
  const { sendEvent } = (isPatch ? usePatchAnalytics : useVersionAnalytics)(
    versionId,
  );

  const { baseStatuses: baseStatusOptions, currentStatuses: statusOptions } =
    useTaskStatuses({
      versionId: childPatchId,
    });

  const onFilterChange = (filterState: ColumnFiltersState) => {
    filterState.forEach(({ id, value }) => {
      if (id === TaskSortCategory.Name) {
        dispatch({ type: "setTaskName", task: value as string });
      }
      if (id === TaskSortCategory.Status) {
        dispatch({ type: "setStatuses", statuses: value as string[] });
      }
      if (id === TaskSortCategory.BaseStatus) {
        dispatch({ type: "setBaseStatuses", baseStatuses: value as string[] });
      }
      if (id === TaskSortCategory.Variant) {
        dispatch({ type: "setVariant", variant: value as string });
      }
    });
    sendEvent({
      name: "Filter Downstream Tasks Table",
      filterBy: Object.keys(filterState),
    });
  };

  const onSortingChange = (sortingState: SortingState) => {
    const updatedSort = sortingState.map(({ desc, id }) => ({
      Key: id as TaskSortCategory,
      Direction: desc ? SortDirection.Desc : SortDirection.Asc,
    }));
    dispatch({ type: "setSort", sorts: updatedSort });
    sendEvent({
      name: "Sort Downstream Tasks Table",
      sortBy: sortingState.map(({ id }) => id as TaskSortCategory),
    });
  };

  const columns = useMemo(
    () =>
      getColumnsTemplate({
        baseStatusOptions,
        statusOptions,
        isPatch,
      }),
    [baseStatusOptions, statusOptions, isPatch],
  );

  const tableContainerRef = useRef<HTMLDivElement>(null);
  const table: LeafyGreenTable<TaskTableInfo> =
    useLeafyGreenTable<TaskTableInfo>({
      columns,
      containerRef: tableContainerRef,
      data: tasks ?? [],
      defaultColumn: {
        enableMultiSort: true,
        sortDescFirst: false, // Handle bug in sorting order (https://github.com/TanStack/table/issues/4289)
      },
      initialState: {
        sorting: [
          { id: TaskSortCategory.Status, desc: false },
          { id: TaskSortCategory.BaseStatus, desc: true },
        ],
      },
      isMultiSortEvent: () => true, // Override default requirement for shift-click to multisort.
      maxMultiSortColCount: 2,
      manualFiltering: true,
      manualPagination: true,
      manualSorting: true,
      onColumnFiltersChange: onChangeHandler<ColumnFiltersState>(
        (f) => getDefaultFiltering(table).onColumnFiltersChange(f),
        onFilterChange,
      ),
      onSortingChange: onChangeHandler<SortingState>(
        (s) => getDefaultSorting(table).onSortingChange(s),
        onSortingChange,
      ),
      getSubRows: (row) => row.executionTasksFull || [],
    });

  return (
    <TableWrapper
      controls={
        <TableControl
          filteredCount={count}
          totalCount={taskCount}
          label="tasks"
          onClear={() => {
            dispatch({ type: "clearAllFilters" });
            table.reset();
          }}
          onPageChange={(p) => dispatch({ type: "setPage", page: p })}
          onPageSizeChange={(l) => dispatch({ type: "setLimit", limit: l })}
          limit={limit}
          page={page}
        />
      }
    >
      <BaseTable
        data-cy="downstream-tasks-table"
        data-cy-row="downstream-tasks-table-row"
        emptyComponent={<TablePlaceholder message="No tasks found." />}
        loading={loading}
        table={table}
        shouldAlternateRowColor
      />
    </TableWrapper>
  );
};
