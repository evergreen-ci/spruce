import { useCallback, useMemo, useRef, useState } from "react";
import { useLeafyGreenTable } from "@leafygreen-ui/table/new";
import {
  SortingState,
  ColumnFiltersState,
  getFacetedMinMaxValues,
} from "@tanstack/react-table";
import { useParams } from "react-router-dom";
import { useVersionAnalytics } from "analytics";
import { BaseTable } from "components/Table/BaseTable";
import {
  getColumnInputFilterProps,
  getColumnTreeSelectFilterProps,
  getColumnSortProps,
} from "components/Table/LGFilters";
import { TablePlaceholder } from "components/Table/TablePlaceholder";
import { TaskLink } from "components/TasksTable/TaskLink";
import TaskStatusBadge from "components/TaskStatusBadge";
import { VersionTaskDurationsQuery } from "gql/generated/types";
import { useTaskStatuses } from "hooks";
import { useQueryParams } from "hooks/useQueryParam";
import { useUpdateURLQueryParams } from "hooks/useUpdateURLQueryParams";
import { PatchTasksQueryParams } from "types/task";
import { TaskDurationCell } from "./TaskDurationCell";

interface Props {
  tasks: VersionTaskDurationsQuery["version"]["tasks"]["data"];
  loading: boolean;
}

export const TaskDurationTable: React.FC<Props> = ({ loading, tasks }) => {
  const { id: versionId } = useParams<{ id: string }>();
  const { sendEvent } = useVersionAnalytics(versionId);
  const { currentStatuses: statusOptions } = useTaskStatuses({ versionId });

  const [queryParams] = useQueryParams();
  const {
    [PatchTasksQueryParams.TaskName]: taskName = "",
    [PatchTasksQueryParams.Statuses]: statuses = [],
    [PatchTasksQueryParams.Variant]: variant = "",
    [PatchTasksQueryParams.Duration]: duration = "",
  } = queryParams;

  const [filters, setFilters] = useState<ColumnFiltersState>([
    { id: PatchTasksQueryParams.TaskName, value: taskName },
    {
      id: PatchTasksQueryParams.Statuses,
      value: Array.isArray(statuses) ? statuses : [statuses],
    },
    { id: PatchTasksQueryParams.Variant, value: variant },
  ]);

  const [sorting, setSorting] = useState<SortingState>([
    {
      id: PatchTasksQueryParams.Duration,
      desc: duration !== "ASC",
    },
  ]);

  const updateQueryParams = useUpdateURLQueryParams();
  const updateUrl = useCallback(
    ({ id, value }) => {
      updateQueryParams({ [id]: value || undefined, page: "0" });
      sendEvent({ name: "Filter Tasks", filterBy: id });
    },
    [sendEvent, updateQueryParams]
  );

  const columns = useMemo(
    () => [
      {
        id: PatchTasksQueryParams.TaskName,
        accessorKey: "displayName",
        header: "Task Name",
        size: 250,
        cell: ({
          getValue,
          row: {
            original: { id },
          },
        }) => <TaskLink taskId={id} taskName={getValue()} />,
        ...getColumnInputFilterProps({
          "data-cy": "task-name-filter-popover",
          onConfirm: updateUrl,
        }),
      },
      {
        id: PatchTasksQueryParams.Statuses,
        accessorKey: "status",
        header: "Status",
        size: 100,
        cell: ({ getValue }) => <TaskStatusBadge status={getValue()} />,
        ...getColumnTreeSelectFilterProps({
          "data-cy": "status-filter-popover",
          tData: statusOptions,
          onConfirm: updateUrl,
        }),
      },
      {
        id: PatchTasksQueryParams.Variant,
        accessorKey: "buildVariantDisplayName",
        header: "Build Variant",
        ...getColumnInputFilterProps({
          "data-cy": "variant-filter-popover",
          onConfirm: updateUrl,
        }),
      },
      {
        id: PatchTasksQueryParams.Duration,
        accessorKey: "timeTaken",
        header: "Task Duration",
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
        ...getColumnSortProps({
          "data-cy": "duration-sort-icon",
          onToggle: updateUrl,
        }),
      },
    ],
    [statusOptions, updateUrl]
  );

  const tableContainerRef = useRef<HTMLDivElement>(null);
  const table = useLeafyGreenTable<
    VersionTaskDurationsQuery["version"]["tasks"]["data"][0]
  >({
    columns,
    containerRef: tableContainerRef,
    data: tasks ?? [],
    state: {
      columnFilters: filters,
      sorting,
    },
    onColumnFiltersChange: setFilters,
    onSortingChange: setSorting,
    getFacetedMinMaxValues: getFacetedMinMaxValues(),
    manualFiltering: true,
    manualSorting: true,
    manualPagination: true,
  });

  return (
    <>
      <BaseTable
        data-cy="task-duration-table-row"
        table={table}
        shouldAlternateRowColor
        emptyComponent={<TablePlaceholder message="No tasks found." />}
        loading={loading}
      />
      {loading && (
        <TablePlaceholder glyph="Refresh" message="Loading..." spin />
      )}
    </>
  );
};
