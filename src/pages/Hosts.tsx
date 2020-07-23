import React, { useState, useEffect } from "react";
import { Table, Skeleton } from "antd";
import { useQuery } from "@apollo/react-hooks";
import { useLocation } from "react-router-dom";
import { ColumnProps } from "antd/es/table";
import {
  TableContainer,
  TableControlOuterRow,
  TableControlInnerRow,
  StyledRouterLink,
  PageWrapper,
} from "components/styles";
import { withBannersContext } from "hoc/withBannersContext";
import { Banners } from "components/Banners";
import {
  useBannerDispatchContext,
  useBannerStateContext,
} from "context/banners";
import { H2 } from "@leafygreen-ui/typography";
import { ErrorBoundary } from "components/ErrorBoundary";
import {
  Host,
  HostsQuery,
  HostsQueryVariables,
  HostSortBy,
  SortDirection,
} from "gql/generated/types";
import { HOSTS } from "gql/queries";
import { getHostRoute, getTaskRoute } from "constants/routes";
import { useDisableTableSortersIfLoading, usePrevious } from "hooks";
import { formatDistanceToNow } from "date-fns";
import { getPageFromSearch, getLimitFromSearch } from "utils/url";
import { parseQueryString, getArray, getString } from "utils";
import { Pagination } from "components/Pagination";
import { PageSizeSelector } from "components/PageSizeSelector";
import { isNetworkRequestInFlight } from "apollo-client/core/networkStatus";

const Hosts: React.FC = () => {
  const dispatchBanner = useBannerDispatchContext();
  const bannersState = useBannerStateContext();

  const { search } = useLocation();
  const prevSearch = usePrevious<string>(search);
  const searchChanged = search !== prevSearch;

  const [initialQueryVariables] = useState<HostsQueryVariables>(
    getQueryVariables(search)
  );

  // HOSTS QUERY
  const { data: hostsData, networkStatus, refetch } = useQuery<
    HostsQuery,
    HostsQueryVariables
  >(HOSTS, {
    variables: initialQueryVariables,
    notifyOnNetworkStatusChange: true,
  });

  // REFETCH HOSTS QUERY IF SEARCH CHANGES
  useEffect(() => {
    if (searchChanged) {
      refetch(getQueryVariables(search));
    }
  }, [searchChanged, search, refetch]);

  const hosts = hostsData?.hosts;
  const hostItems = hosts?.hosts ?? [];
  const totalHostsCount = hosts?.totalHostsCount ?? 0;
  const filteredHostCount = hosts?.filteredHostsCount ?? 0;

  useDisableTableSortersIfLoading(networkStatus);

  const {
    limit,
    page,
    hostId,
    currentTaskId,
    distroId,
    statuses,
    startedBy,
  } = getQueryVariables(search);

  const hasFilters =
    hostId || currentTaskId || distroId || statuses || startedBy;

  const isLoading = isNetworkRequestInFlight(networkStatus);

  return (
    <PageWrapper data-cy="hosts-page">
      <Banners
        banners={bannersState}
        removeBanner={dispatchBanner.removeBanner}
      />
      <H2>Evergreen Hosts</H2>
      <ErrorBoundary>
        <TableControlOuterRow>
          <div data-cy="filtered-hosts-count">
            {hasFilters && `Showing ${filteredHostCount} of ${totalHostsCount}`}
          </div>
          <TableControlInnerRow>
            <Pagination
              dataTestId="tasks-table-pagination"
              pageSize={limit}
              value={page}
              totalResults={totalHostsCount}
            />
            <PageSizeSelector
              dataTestId="tasks-table-page-size-selector"
              value={limit}
            />
          </TableControlInnerRow>
        </TableControlOuterRow>
        <TableContainer hide={isLoading}>
          <Table
            data-test-id="tasks-table"
            rowKey={rowKey}
            pagination={false}
            columns={columnsTemplate}
            dataSource={hostItems}
            onChange={() => undefined}
          />
        </TableContainer>
        {isLoading && <Skeleton active title={false} paragraph={{ rows: 8 }} />}
      </ErrorBoundary>
    </PageWrapper>
  );
};

type QueryParam = keyof HostsQueryVariables;

const getSortBy = (sortByParam: string | string[] = ""): HostSortBy => {
  const sortBy = getString(sortByParam) as HostSortBy;

  return Object.values(HostSortBy).includes(sortBy)
    ? sortBy
    : HostSortBy.Status;
};

const getSortDir = (sortDirParam: string | string[]): SortDirection => {
  const sortDir = getString(sortDirParam) as SortDirection;

  return Object.values(SortDirection).includes(sortDir)
    ? sortDir
    : SortDirection.Asc;
};

const getQueryVariables = (search: string): HostsQueryVariables => {
  const {
    hostId,
    distroId,
    currentTaskId,
    statuses,
    startedBy,
    sortBy,
    sortDir,
  } = parseQueryString(search) as { [key in QueryParam]: string | string[] };

  return {
    hostId: getString(hostId),
    distroId: getString(distroId),
    currentTaskId: getString(currentTaskId),
    statuses: getArray(statuses),
    startedBy: getString(startedBy),
    sortBy: getSortBy(sortBy),
    sortDir: getSortDir(sortDir),
    page: getPageFromSearch(search),
    limit: getLimitFromSearch(search),
  };
};

enum TableColumnHeader {
  Id = "ID",
  Distro = "DISTRO",
  Status = "STATUS",
  CurrentTask = "CURRENT_TASK",
  Elapsed = "ELAPSED",
  Uptime = "UPTIME",
  IdleTime = "IDLE_TIME",
  Owner = "OWNER",
}

const columnsTemplate: Array<ColumnProps<Host>> = [
  {
    title: "ID",
    dataIndex: "id",
    key: TableColumnHeader.Id,
    sorter: true,
    className: "cy-hosts-table-col-ID",
    render: (_, { id }: Host): JSX.Element => (
      <StyledRouterLink data-cy="host-id-link" to={getHostRoute(id)}>
        {id}
      </StyledRouterLink>
    ),
  },
  {
    title: "Distro",
    dataIndex: "distroId",
    key: TableColumnHeader.Distro,
    sorter: true,
    className: "cy-task-table-col-DISTRO",
  },
  {
    title: "Status",
    dataIndex: "status",
    key: TableColumnHeader.Status,
    sorter: true,
    className: "cy-task-table-col-STATUS",
  },
  {
    title: "Current Task",
    dataIndex: "currentTask",
    key: TableColumnHeader.CurrentTask,
    sorter: true,
    className: "cy-task-table-col-CURRENT-TASK",
    render: (_, { runningTask }: Host) =>
      runningTask?.id !== null ? (
        <StyledRouterLink
          data-cy="current-task-link"
          to={getTaskRoute(runningTask?.id)}
        >
          {runningTask?.name}
        </StyledRouterLink>
      ) : (
        ""
      ),
  },
  {
    title: "Elapsed",
    dataIndex: "elapsed",
    key: TableColumnHeader.Elapsed,
    sorter: true,
    className: "cy-task-table-col-ELAPSED",
    render: (_, { elapsed }) =>
      elapsed ? formatDistanceToNow(new Date(elapsed)) : "N/A",
  },
  {
    title: "Uptime",
    dataIndex: "uptime",
    key: TableColumnHeader.Uptime,
    sorter: true,
    className: "cy-task-table-col-UPTIME",
    render: (_, { uptime }) =>
      uptime ? formatDistanceToNow(new Date(uptime)) : "N/A",
  },
  {
    title: "Idle Time",
    dataIndex: "totalIdleTime",
    key: TableColumnHeader.IdleTime,
    sorter: true,
    className: "cy-task-table-col-IDLE-TIME",
    render: (_, { totalIdleTime }) =>
      totalIdleTime ? formatDistanceToNow(new Date(totalIdleTime)) : "N/A",
  },
  {
    title: "Owner",
    dataIndex: "startedBy",
    key: TableColumnHeader.Owner,
    sorter: true,
    className: "cy-task-table-col-OWNER",
  },
];

const rowKey = ({ id }: { id: string }): string => id;

const HostsWithBannersContext = withBannersContext(Hosts);

export { HostsWithBannersContext as Hosts };
