import { useMemo, useRef } from "react";
import { useLeafyGreenTable } from "@leafygreen-ui/table";
import {
  ColumnFiltersState,
  Filters,
  Sorting,
  SortingState,
  getFacetedMinMaxValues,
} from "@tanstack/react-table";
import { useParams } from "react-router-dom";
import { useVersionAnalytics } from "analytics";
import { BaseTable } from "components/Table/BaseTable";
import { TablePlaceholder } from "components/Table/TablePlaceholder";
import { onChangeHandler } from "components/Table/utils";
import { TaskLink } from "components/TasksTable/TaskLink";
import TaskStatusBadge from "components/TaskStatusBadge";
import { slugs } from "constants/routes";
import { VersionTaskDurationsQuery, SortDirection } from "gql/generated/types";
import { useTaskStatuses } from "hooks";
import { useQueryParams } from "hooks/useQueryParam";
import { PatchTasksQueryParams } from "types/task";
import { TaskDurationCell } from "./TaskDurationCell";

const { getDefaultOptions: getDefaultFiltering } = Filters;
const { getDefaultOptions: getDefaultSorting } = Sorting;

interface Props {
  tasks: VersionTaskDurationsQuery["version"]["tasks"]["data"];
  loading: boolean;
  numLoadingRows: number;
}

export const TaskDurationTable: React.FC<Props> = ({
  loading,
  numLoadingRows,
  tasks,
}) => {
  const { [slugs.versionId]: versionId } = useParams();
  const { sendEvent } = useVersionAnalytics(versionId);
  const { currentStatuses: statusOptions } = useTaskStatuses({ versionId });

  const [queryParams, setQueryParams] = useQueryParams();

  const { initialFilters, initialSort } = useMemo(
    () => getInitialParams(queryParams),
    [], // eslint-disable-line react-hooks/exhaustive-deps
  );

  const setFilters = (f: ColumnFiltersState) =>
    getDefaultFiltering(table).onColumnFiltersChange(f);

  const updateFilters = (filterState: ColumnFiltersState) => {
    const updatedParams = {
      ...queryParams,
      page: "0",
      [PatchTasksQueryParams.TaskName]: undefined,
      [PatchTasksQueryParams.Statuses]: undefined,
      [PatchTasksQueryParams.Variant]: undefined,
    };

    filterState.forEach(({ id, value }) => {
      updatedParams[id] = value;
    });

    setQueryParams(updatedParams);
    sendEvent({ name: "Filter Tasks", filterBy: Object.keys(filterState) });
  };

  const setSorting = (s: SortingState) =>
    getDefaultSorting(table).onSortingChange(s);

  const updateSort = (sortState: SortingState) => {
    const updatedParams = {
      ...queryParams,
      page: "0",
      [PatchTasksQueryParams.Duration]: undefined,
    };

    sortState.forEach(({ desc, id }) => {
      updatedParams[id] = desc ? SortDirection.Desc : SortDirection.Asc;
    });

    setQueryParams(updatedParams);
  };

  const columns = useMemo(
    () => [
      {
        id: PatchTasksQueryParams.TaskName,
        accessorKey: "displayName",
        header: "Task Name",
        size: 250,
        enableColumnFilter: true,
        cell: ({
          getValue,
          row: {
            original: { id },
          },
        }) => <TaskLink taskId={id} taskName={getValue()} />,
        meta: {
          search: {
            "data-cy": "task-name-filter-popover",
          },
        },
      },
      {
        id: PatchTasksQueryParams.Statuses,
        accessorKey: "status",
        header: "Status",
        size: 120,
        enableColumnFilter: true,
        cell: ({ getValue }) => <TaskStatusBadge status={getValue()} />,
        meta: {
          treeSelect: {
            "data-cy": "status-filter-popover",
            options: statusOptions,
          },
        },
      },
      {
        id: PatchTasksQueryParams.Variant,
        accessorKey: "buildVariantDisplayName",
        header: "Build Variant",
        size: 150,
        enableColumnFilter: true,
        meta: {
          search: {
            "data-cy": "build-variant-filter-popover",
          },
        },
      },
      {
        id: PatchTasksQueryParams.Duration,
        accessorKey: "timeTaken",
        header: "Task Duration",
        enableColumnFilter: false,
        enableSorting: true,
        size: 250,
        cell: ({
          column,
          getValue,
          row: {
            original: { status },
          },
        }) => (
          <TaskDurationCell
            status={status}
            maxTimeTaken={column.getFacetedMinMaxValues()?.[1] ?? 0}
            timeTaken={getValue()}
          />
        ),
      },
    ],
    [statusOptions],
  );

  const tableContainerRef = useRef<HTMLDivElement>(null);
  const table = useLeafyGreenTable<
    VersionTaskDurationsQuery["version"]["tasks"]["data"][0]
  >({
    columns,
    containerRef: tableContainerRef,
    data: tasks ?? [],
    defaultColumn: {
      // Handle bug in sorting order
      // https://github.com/TanStack/table/issues/4289
      sortDescFirst: false,
    },
    getFacetedMinMaxValues: getFacetedMinMaxValues(),
    initialState: {
      columnFilters: initialFilters,
      sorting: initialSort,
    },
    manualFiltering: true,
    manualPagination: true,
    manualSorting: true,
    onColumnFiltersChange: onChangeHandler<ColumnFiltersState>(
      setFilters,
      (updatedState) => {
        updateFilters(updatedState);
        table.resetRowSelection();
      },
    ),
    onSortingChange: onChangeHandler<SortingState>(
      setSorting,
      (updatedState) => {
        updateSort(updatedState);
        table.resetRowSelection();
      },
    ),
  });

  return (
    <BaseTable
      data-cy="task-duration-table"
      data-cy-row="task-duration-table-row"
      emptyComponent={<TablePlaceholder message="No tasks found." />}
      loading={loading}
      table={table}
      shouldAlternateRowColor
      loadingRows={numLoadingRows}
    />
  );
};

const getInitialParams = (queryParams: {
  [key: string]: any;
}): {
  initialFilters: ColumnFiltersState;
  initialSort: SortingState;
} => {
  const {
    [PatchTasksQueryParams.TaskName]: taskName,
    [PatchTasksQueryParams.Statuses]: statuses,
    [PatchTasksQueryParams.Variant]: variant,
    [PatchTasksQueryParams.Duration]: duration,
  } = queryParams;

  const initialFilters = [];
  if (taskName) {
    initialFilters.push({
      id: PatchTasksQueryParams.TaskName,
      value: taskName,
    });
  }
  if (statuses) {
    initialFilters.push({
      id: PatchTasksQueryParams.Statuses,
      value: Array.isArray(statuses) ? statuses : [statuses],
    });
  }
  if (variant) {
    initialFilters.push({ id: PatchTasksQueryParams.Variant, value: variant });
  }

  return {
    initialFilters,
    initialSort: duration
      ? [
          {
            id: PatchTasksQueryParams.Duration,
            desc: duration === SortDirection.Desc,
          },
        ]
      : [
          {
            id: PatchTasksQueryParams.Duration,
            desc: true,
          },
        ],
  };
};
