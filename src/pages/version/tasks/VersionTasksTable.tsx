import { useMemo, useRef, useState } from "react";
import { useLeafyGreenTable, LeafyGreenTable } from "@leafygreen-ui/table";
import { ColumnFiltersState, SortingState } from "@tanstack/react-table";
import { useParams } from "react-router-dom";
import { useVersionAnalytics, usePatchAnalytics } from "analytics";
import { BaseTable } from "components/Table/BaseTable";
import TableControl from "components/Table/TableControl";
import { TablePlaceholder } from "components/Table/TablePlaceholder";
import TableWrapper from "components/Table/TableWrapper";
import { onChangeHandler } from "components/Table/utils";
import { getColumnsTemplate } from "components/TasksTable/Columns";
import { TaskTableInfo } from "components/TasksTable/types";
import {
  VersionTasksQuery,
  SortDirection,
  TaskSortCategory,
} from "gql/generated/types";
import { useTaskStatuses, useTableSort } from "hooks";
import { useQueryParams } from "hooks/useQueryParam";
import { PatchTasksQueryParams } from "types/task";
import { parseSortString } from "utils/queryString";
import {
  mapFilterParamToId,
  mapIdToFilterParam,
  emptyFilterQueryParams,
} from "./constants";

interface Props {
  filteredCount: number;
  isPatch: boolean;
  limit: number;
  loading: boolean;
  clearQueryParams: () => void;
  page: number;
  tasks: VersionTasksQuery["version"]["tasks"]["data"];
  totalCount: number;
}

export const VersionTasksTable: React.FC<Props> = ({
  clearQueryParams,
  filteredCount,
  isPatch,
  limit,
  loading,
  page,
  tasks,
  totalCount,
}) => {
  const [queryParams, setQueryParams] = useQueryParams();
  const { id: versionId } = useParams<{ id: string }>();
  const { sendEvent } = (isPatch ? usePatchAnalytics : useVersionAnalytics)(
    versionId,
  );

  const { initialFilters, initialSorting } = useMemo(
    () => getInitialState(queryParams),
    [], // eslint-disable-line react-hooks/exhaustive-deps
  );

  const [columnFilters, setColumnFilters] =
    useState<ColumnFiltersState>(initialFilters);
  const [sorting, setSorting] = useState<SortingState>(initialSorting);

  const { baseStatuses: baseStatusOptions, currentStatuses: statusOptions } =
    useTaskStatuses({ versionId });

  const updateFilters = (filterState: ColumnFiltersState) => {
    const updatedParams = {
      ...queryParams,
      page: "0",
      ...emptyFilterQueryParams,
    };
    filterState.forEach(({ id, value }) => {
      const key = mapIdToFilterParam[id];
      updatedParams[key] = value;
    });
    setQueryParams(updatedParams);
    sendEvent({
      name: "Filter Tasks Table",
      filterBy: Object.keys(filterState),
    });
  };

  const updateSorting = useTableSort({
    sendAnalyticsEvents: (sorter: SortingState) =>
      sendEvent({
        name: "Sort Tasks Table",
        sortBy: sorter.map(({ id }) => id as TaskSortCategory),
      }),
  });

  const columns = useMemo(
    () =>
      getColumnsTemplate({
        baseStatusOptions,
        statusOptions,
        isPatch,
        onClickTaskLink: (taskId: string) =>
          sendEvent({
            name: "Click Task Table Link",
            taskId,
          }),
      }),
    [baseStatusOptions, statusOptions, isPatch, sendEvent],
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
      state: {
        columnFilters,
        sorting,
      },
      isMultiSortEvent: () => true, // Override default requirement for shift-click to multisort.
      maxMultiSortColCount: 2,
      manualFiltering: true,
      manualPagination: true,
      manualSorting: true,
      onColumnFiltersChange: onChangeHandler<ColumnFiltersState>(
        setColumnFilters,
        updateFilters,
      ),
      onSortingChange: onChangeHandler<SortingState>(setSorting, updateSorting),
      getSubRows: (row) => row.executionTasksFull || [],
    });

  return (
    <TableWrapper
      controls={
        <TableControl
          filteredCount={filteredCount}
          label="tasks"
          limit={limit}
          page={page}
          onClear={() => {
            setColumnFilters([]);
            setSorting(defaultSorting);
            clearQueryParams();
          }}
          onPageSizeChange={() => {
            sendEvent({
              name: "Change Page Size",
            });
          }}
          totalCount={totalCount}
        />
      }
      shouldShowBottomTableControl={tasks.length > 10}
    >
      <BaseTable
        data-cy="tasks-table"
        data-cy-row="tasks-table-row"
        disableAnimations={limit === 100}
        emptyComponent={<TablePlaceholder message="No tasks found." />}
        loading={loading}
        shouldAlternateRowColor
        table={table}
      />
    </TableWrapper>
  );
};

const defaultSorting = [
  { id: TaskSortCategory.Status, desc: false },
  { id: TaskSortCategory.BaseStatus, desc: true },
];

const getInitialState = (queryParams: {
  [key: string]: any;
}): {
  initialFilters: ColumnFiltersState;
  initialSorting: SortingState;
} => {
  const { [PatchTasksQueryParams.Sorts]: sorts } = queryParams;
  const parsedSorts = parseSortString(sorts);

  return {
    initialSorting: sorts
      ? parsedSorts.map(({ Direction, Key }) => ({
          id: Key,
          desc: Direction === SortDirection.Desc,
        }))
      : defaultSorting,
    initialFilters: Object.entries(mapFilterParamToId).reduce(
      (accum, [param, id]) => {
        if (queryParams[param]?.length) {
          return [...accum, { id, value: queryParams[param] }];
        }
        return accum;
      },
      [],
    ),
  };
};
