import { useCallback, useMemo, useRef } from "react";
import { useLeafyGreenTable } from "@leafygreen-ui/table";
import { getFacetedMinMaxValues } from "@tanstack/react-table";
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
import { VersionTaskDurationsQuery, SortDirection } from "gql/generated/types";
import { useTaskStatuses } from "hooks";
import { useQueryParams } from "hooks/useQueryParam";
import { useUpdateURLQueryParams } from "hooks/useUpdateURLQueryParams";
import { PatchTasksQueryParams } from "types/task";
import { TaskDurationCell } from "./TaskDurationCell";

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
  const { id: versionId } = useParams<{ id: string }>();
  const { sendEvent } = useVersionAnalytics(versionId);
  const { currentStatuses: statusOptions } = useTaskStatuses({ versionId });

  const [
    {
      [PatchTasksQueryParams.TaskName]: taskName = "",
      [PatchTasksQueryParams.Statuses]: statuses = [],
      [PatchTasksQueryParams.Variant]: variant = "",
      [PatchTasksQueryParams.Duration]: duration = "",
    },
  ] = useQueryParams();

  const filters = useMemo(
    () => [
      { id: PatchTasksQueryParams.TaskName, value: taskName },
      {
        id: PatchTasksQueryParams.Statuses,
        value: Array.isArray(statuses) ? statuses : [statuses],
      },
      { id: PatchTasksQueryParams.Variant, value: variant },
    ],
    [taskName, statuses, variant]
  );

  const sorting = useMemo(
    () => [
      ...(duration && [
        {
          id: PatchTasksQueryParams.Duration,
          desc: duration === SortDirection.Desc,
        },
      ]),
    ],
    [duration]
  );

  const updateQueryParams = useUpdateURLQueryParams();
  const updateUrl = useCallback(
    ({ id, value }) => {
      updateQueryParams({ [id]: value || undefined, page: "0" });
    },
    [updateQueryParams]
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
          onConfirm: (filter) => {
            updateUrl(filter);
            sendEvent({ name: "Filter Tasks", filterBy: filter.id });
          },
        }),
      },
      {
        id: PatchTasksQueryParams.Statuses,
        accessorKey: "status",
        header: "Status",
        size: 120,
        cell: ({ getValue }) => <TaskStatusBadge status={getValue()} />,
        ...getColumnTreeSelectFilterProps({
          "data-cy": "status-filter-popover",
          tData: statusOptions,
          onConfirm: (filter) => {
            updateUrl(filter);
            sendEvent({ name: "Filter Tasks", filterBy: filter.id });
          },
        }),
      },
      {
        id: PatchTasksQueryParams.Variant,
        accessorKey: "buildVariantDisplayName",
        header: "Build Variant",
        size: 150,
        ...getColumnInputFilterProps({
          "data-cy": "build-variant-filter-popover",
          onConfirm: (filter) => {
            updateUrl(filter);
            sendEvent({ name: "Filter Tasks", filterBy: filter.id });
          },
        }),
      },
      {
        id: PatchTasksQueryParams.Duration,
        accessorKey: "timeTaken",
        header: "Task Duration",
        enableColumnFilter: false,
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
    [statusOptions, sendEvent, updateUrl]
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
    getFacetedMinMaxValues: getFacetedMinMaxValues(),
    manualFiltering: true,
    manualSorting: true,
    manualPagination: true,
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
