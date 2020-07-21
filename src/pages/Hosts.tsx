import React from "react";
import { Table, Skeleton } from "antd";
import { useQuery } from "@apollo/react-hooks";
import { useLocation } from "react-router-dom";
import { ColumnProps } from "antd/es/table";
import {
  TableContainer,
  TableControlOuterRow,
  TableControlInnerRow,
  StyledRouterLink,
} from "components/styles";
import { withBannersContext } from "hoc/withBannersContext";
import { Banners } from "components/Banners";
import { PageWrapper } from "components/styles";
import {
  useBannerDispatchContext,
  useBannerStateContext,
} from "context/banners";
import { H2 } from "@leafygreen-ui/typography";
import { ErrorBoundary } from "components/ErrorBoundary";
import { Host, HostsQuery, HostsQueryVariables } from "gql/generated/types";
import { HOSTS } from "gql/queries";
import { getHostRoute, getTaskRoute } from "constants/routes";
import { useDisableTableSortersIfLoading, usePollQuery } from "hooks";
import { formatDistanceToNow } from "date-fns";

const Hosts: React.FC = () => {
  const dispatchBanner = useBannerDispatchContext();
  const bannersState = useBannerStateContext();

  const { data: hostsData, networkStatus, refetch } = useQuery<
    HostsQuery,
    HostsQueryVariables
  >(HOSTS, {
    variables: { hostId: null },
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "network-only",
  });

  useDisableTableSortersIfLoading(networkStatus);

  const { search } = useLocation();

  const { showSkeleton } = usePollQuery({
    networkStatus,
    getQueryVariables,
    refetch,
    search,
  });

  return (
    <PageWrapper data-cy="hosts-page">
      <Banners
        banners={bannersState}
        removeBanner={dispatchBanner.removeBanner}
      />
      <H2>Evergreen Hosts</H2>
      <ErrorBoundary>
        <TableControlOuterRow>
          <TableControlInnerRow>
            {/** TODO: Put pagination here */}
          </TableControlInnerRow>
        </TableControlOuterRow>
        <TableContainer hide={showSkeleton}>
          <Table
            data-test-id="tasks-table"
            rowKey={rowKey}
            pagination={false}
            columns={columnsTemplate}
            dataSource={hostsData?.hosts?.hosts ?? []}
            onChange={() => undefined}
          />
        </TableContainer>
        {showSkeleton && (
          <Skeleton active title={false} paragraph={{ rows: 8 }} />
        )}
      </ErrorBoundary>
    </PageWrapper>
  );
};

// TODO: include query parameters
const getQueryVariables = (): HostsQueryVariables => ({
  hostId: null,
});

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
    render: (name: string, { id }: Host): JSX.Element => (
      <StyledRouterLink to={getHostRoute(id)}>{id}</StyledRouterLink>
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
    render: (name: string, { runningTask }: Host) =>
      runningTask?.id !== null ? (
        <StyledRouterLink to={getTaskRoute(runningTask?.id)}>
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
