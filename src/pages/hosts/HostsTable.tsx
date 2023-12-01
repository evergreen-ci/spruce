import { useRef, useState } from "react";
import { useLeafyGreenTable } from "@leafygreen-ui/table";
import {
  ColumnFiltersState,
  RowSelectionState,
  SortingState,
} from "@tanstack/react-table";
import { formatDistanceToNow } from "date-fns";
import { useHostsTableAnalytics } from "analytics";
import { StyledRouterLink, WordBreak } from "components/styles";
import { BaseTable } from "components/Table/BaseTable";
import { onChangeHandler } from "components/Table/utils";
import { hostStatuses } from "constants/hosts";
import { getHostRoute, getTaskRoute } from "constants/routes";
import { HostSortBy, HostsQuery } from "gql/generated/types";
import { useTableSort } from "hooks";
import { useQueryParams } from "hooks/useQueryParam";
import { mapIdToFilterParam } from "types/host";
import { Unpacked } from "types/utils";

type Host = Unpacked<HostsQuery["hosts"]["hosts"]>;

interface Props {
  initialFilters: ColumnFiltersState;
  initialSorting: SortingState;
  hosts: HostsQuery["hosts"]["hosts"];
  limit: number;
  loading: boolean;
  setSelectedHosts: React.Dispatch<React.SetStateAction<Host[]>>;
}

export const HostsTable: React.FC<Props> = ({
  hosts,
  initialFilters,
  initialSorting,
  limit,
  loading,
  setSelectedHosts,
}) => {
  const { sendEvent } = useHostsTableAnalytics();

  const tableSortHandler = useTableSort({
    sendAnalyticsEvents: () => sendEvent({ name: "Sort Hosts" }),
  });

  const [, setQueryParams] = useQueryParams();

  const [filters, setFilters] = useState<ColumnFiltersState>(initialFilters);
  const [sorting, setSorting] = useState<SortingState>(initialSorting);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  const updateRowSelection = (rowState: RowSelectionState) => {
    const selectedHosts = Object.keys(rowState).map(
      (key) => table.getRowModel().rowsById[key]?.original
    );
    setSelectedHosts(selectedHosts);
  };

  const updateFilters = (filterState: ColumnFiltersState) => {
    const updatedParams = { page: "0" };

    filterState.forEach(({ id, value }) => {
      const key = mapIdToFilterParam[id];
      updatedParams[key] = value;
    });

    setQueryParams(updatedParams);
    sendEvent({ name: "Filter Hosts", filterBy: Object.keys(filterState) });
  };

  const tableContainerRef = useRef<HTMLDivElement>(null);
  const table = useLeafyGreenTable<Host>({
    columns,
    containerRef: tableContainerRef,
    data: hosts ?? [],
    defaultColumn: {
      enableColumnFilter: false,
      enableSorting: false,
      // Handle bug in sorting order
      // https://github.com/TanStack/table/issues/4289
      sortDescFirst: false,
    },
    state: {
      columnFilters: filters,
      rowSelection,
      sorting,
    },
    hasSelectableRows: true,
    manualFiltering: true,
    manualSorting: true,
    manualPagination: true,
    onColumnFiltersChange: onChangeHandler<ColumnFiltersState>(
      setFilters,
      (updatedState) => {
        updateFilters(updatedState);
        table.resetRowSelection();
      }
    ),
    onRowSelectionChange: onChangeHandler<RowSelectionState>(
      setRowSelection,
      updateRowSelection
    ),
    onSortingChange: onChangeHandler<SortingState>(
      setSorting,
      (updatedState) => {
        tableSortHandler(updatedState);
        table.resetRowSelection();
      }
    ),
  });

  return (
    <BaseTable
      data-cy="hosts-table"
      data-loading={loading}
      loading={loading}
      loadingRows={limit}
      shouldAlternateRowColor
      table={table}
    />
  );
};

const columns = [
  {
    header: "ID",
    accessorKey: "id",
    id: HostSortBy.Id,
    cell: ({ getValue }): JSX.Element => {
      const id = getValue();
      return (
        <StyledRouterLink data-cy="host-id-link" to={getHostRoute(id)}>
          <WordBreak>{id}</WordBreak>
        </StyledRouterLink>
      );
    },
    enableColumnFilter: true,
    enableSorting: true,
    meta: {
      search: {
        "data-cy": "host-id-filter",
        placeholder: "Search ID or DNS name",
      },
      width: "17%",
    },
  },
  {
    header: "Distro",
    accessorKey: "distroId",
    id: HostSortBy.Distro,
    enableColumnFilter: true,
    enableSorting: true,
    meta: {
      search: {
        "data-cy": "distro-id-filter",
        placeholder: "Search distro regex",
      },
      width: "15%",
    },
  },
  {
    header: "Status",
    accessorKey: "status",
    id: HostSortBy.Status,
    enableColumnFilter: true,
    enableSorting: true,
    meta: {
      treeSelect: {
        "data-cy": "statuses-filter",
        options: hostStatuses,
      },
      width: "10%",
    },
  },
  {
    header: "Current Task",
    accessorKey: "runningTask",
    id: HostSortBy.CurrentTask,
    cell: ({ getValue }) => {
      const task = getValue();
      return task?.id !== null ? (
        <StyledRouterLink
          data-cy="current-task-link"
          to={getTaskRoute(task?.id)}
        >
          <WordBreak>{task?.name}</WordBreak>
        </StyledRouterLink>
      ) : (
        ""
      );
    },
    enableColumnFilter: true,
    enableSorting: true,
    meta: {
      search: {
        "data-cy": "current-task-id-filter",
        placeholder: "Search by task ID",
      },
      width: "18%",
    },
  },
  {
    header: "Elapsed",
    accessorKey: "elapsed",
    id: HostSortBy.Elapsed,
    cell: ({ getValue }) => {
      const elapsed = getValue();
      return elapsed ? formatDistanceToNow(new Date(elapsed)) : "N/A";
    },
    enableSorting: true,
    meta: {
      width: "10%",
    },
  },
  {
    header: "Uptime",
    accessorKey: "uptime",
    id: HostSortBy.Uptime,
    cell: ({ getValue }) => {
      const uptime = getValue();
      return uptime ? formatDistanceToNow(new Date(uptime)) : "N/A";
    },
    enableSorting: true,
    meta: {
      width: "10%",
    },
  },
  {
    header: "Idle Time",
    accessorKey: "totalIdleTime",
    id: HostSortBy.IdleTime,
    cell: ({ getValue }) => {
      const totalIdleTime = getValue();
      return totalIdleTime
        ? formatDistanceToNow(new Date(Date.now() - totalIdleTime))
        : "N/A";
    },
    enableSorting: true,
    meta: {
      width: "10%",
    },
  },
  {
    header: "Owner",
    accessorKey: "startedBy",
    id: HostSortBy.Owner,
    cell: ({ getValue }) => <WordBreak>{getValue()}</WordBreak>,
    enableColumnFilter: true,
    enableSorting: true,
    meta: {
      search: {
        "data-cy": "owner-filter",
      },
      width: "10%",
    },
  },
];
