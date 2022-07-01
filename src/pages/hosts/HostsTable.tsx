import { Table } from "antd";
import { ColumnProps } from "antd/es/table";
import { TableRowSelection } from "antd/es/table/interface";
import { formatDistanceToNow } from "date-fns";
import { useHostsTableAnalytics } from "analytics";
import { StyledRouterLink } from "components/styles";
import {
  getColumnSearchFilterProps,
  getColumnCheckboxFilterProps,
} from "components/Table/Filters";
import { hostStatuses } from "constants/hosts";
import { getHostRoute, getTaskRoute } from "constants/routes";
import {
  HostsQueryVariables,
  SortDirection,
  HostSortBy,
  HostsQuery,
} from "gql/generated/types";
import {
  useUpdateUrlSortParamOnTableChange,
  useTableInputFilter,
  useTableCheckboxFilter,
} from "hooks";

interface Props {
  hosts: HostsQuery["hosts"]["hosts"];
  sortBy: HostsQueryVariables["sortBy"];
  sortDir: HostsQueryVariables["sortDir"];
  selectedHostIds: string[];
  loading: boolean;
  setSelectedHostIds: React.Dispatch<React.SetStateAction<string[]>>;
  setCanRestartJasper: React.Dispatch<React.SetStateAction<boolean>>;
  setRestartJasperError: React.Dispatch<React.SetStateAction<string>>;
  setCanReprovision: React.Dispatch<React.SetStateAction<boolean>>;
  setReprovisionError: React.Dispatch<React.SetStateAction<string>>;
}

type Host = HostsQuery["hosts"]["hosts"][0];

type HostsUrlParam = keyof HostsQueryVariables;

export const HostsTable: React.VFC<Props> = ({
  hosts,
  sortBy,
  sortDir,
  selectedHostIds,
  setSelectedHostIds,
  setCanRestartJasper,
  setRestartJasperError,
  setCanReprovision,
  setReprovisionError,
  loading,
}) => {
  const hostsTableAnalytics = useHostsTableAnalytics();

  const tableChangeHandler = useUpdateUrlSortParamOnTableChange<Host>({
    sendAnalyticsEvents: () =>
      hostsTableAnalytics.sendEvent({ name: "Sort Hosts" }),
  });

  const getDefaultSortOrder = (
    key: HostSortBy
  ): ColumnProps<Host>["defaultSortOrder"] => {
    if (sortBy === key) {
      return sortDir === SortDirection.Asc ? "ascend" : "descend";
    }
    return null;
  };

  const sendHostsTableFilterEvent = (filterBy: string) =>
    hostsTableAnalytics.sendEvent({ name: "Filter Hosts", filterBy });

  // HOST ID URL PARAM
  const [
    hostIdValue,
    onChangeHostId,
    updateHostIdUrlParam,
  ] = useTableInputFilter<HostsUrlParam>({
    urlSearchParam: "hostId",
    sendAnalyticsEvent: sendHostsTableFilterEvent,
  });

  // STATUSES URL PARAM
  const [
    statusesValue,
    onChangeStatuses,
  ] = useTableCheckboxFilter<HostsUrlParam>({
    urlSearchParam: "statuses",
    sendAnalyticsEvent: sendHostsTableFilterEvent,
  });

  // DISTRO URL PARAM
  const [
    distroIdValue,
    onChangeDistroId,
    updateDistroIdUrlParam,
  ] = useTableInputFilter<HostsUrlParam>({
    urlSearchParam: "distroId",
    sendAnalyticsEvent: sendHostsTableFilterEvent,
  });

  // CURRENT TASK ID URL PARAM
  const [
    currentTaskIdValue,
    onChangeCurrentTaskId,
    updateCurrentTaskIdUrlParam,
  ] = useTableInputFilter<HostsUrlParam>({
    urlSearchParam: "currentTaskId",
    sendAnalyticsEvent: sendHostsTableFilterEvent,
  });

  // OWNER URL PARAM
  const [
    ownerValue,
    onChangeOwner,
    updateOwnerUrlParam,
  ] = useTableInputFilter<HostsUrlParam>({
    urlSearchParam: "startedBy",
    sendAnalyticsEvent: sendHostsTableFilterEvent,
  });

  // TABLE COLUMNS
  const columnsTemplate: Array<ColumnProps<Host>> = [
    {
      title: "ID",
      dataIndex: "id",
      key: HostSortBy.Id,
      sorter: true,
      className: "cy-hosts-table-col-ID",
      defaultSortOrder: getDefaultSortOrder(HostSortBy.Id),
      width: "15%",
      render: (_, { id }: Host): JSX.Element => (
        <StyledRouterLink data-cy="host-id-link" to={getHostRoute(id)}>
          {id}
        </StyledRouterLink>
      ),
      ...getColumnSearchFilterProps({
        placeholder: "Search ID",
        value: hostIdValue,
        onChange: onChangeHostId,
        "data-cy": "host-id-filter",
        onFilter: updateHostIdUrlParam,
      }),
    },
    {
      title: "Distro",
      dataIndex: "distroId",
      defaultSortOrder: getDefaultSortOrder(HostSortBy.Distro),
      key: HostSortBy.Distro,
      sorter: true,
      width: "15%",
      className: "cy-task-table-col-DISTRO",
      ...getColumnSearchFilterProps({
        placeholder: "Search distro regex",
        value: distroIdValue,
        onChange: onChangeDistroId,
        "data-cy": "distro-id-filter",
        onFilter: updateDistroIdUrlParam,
      }),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: HostSortBy.Status,
      defaultSortOrder: getDefaultSortOrder(HostSortBy.Status),
      sorter: true,
      width: "15%",
      className: "cy-task-table-col-STATUS",
      ...getColumnCheckboxFilterProps({
        value: statusesValue,
        onChange: onChangeStatuses,
        dataCy: "statuses-filter",
        statuses: hostStatuses,
      }),
    },
    {
      title: "Current Task",
      dataIndex: "currentTask",
      key: HostSortBy.CurrentTask,
      defaultSortOrder: getDefaultSortOrder(HostSortBy.CurrentTask),
      sorter: true,
      width: "15%",
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
      ...getColumnSearchFilterProps({
        placeholder: "Search Current Task ID",
        value: currentTaskIdValue,
        onChange: onChangeCurrentTaskId,
        "data-cy": "current-task-id-filter",
        onFilter: updateCurrentTaskIdUrlParam,
      }),
    },
    {
      title: "Elapsed",
      dataIndex: "elapsed",
      defaultSortOrder: getDefaultSortOrder(HostSortBy.Elapsed),
      key: HostSortBy.Elapsed,
      sorter: true,
      className: "cy-task-table-col-ELAPSED",
      width: "10%",
      render: (_, { elapsed }) =>
        elapsed ? formatDistanceToNow(new Date(elapsed)) : "N/A",
    },
    {
      title: "Uptime",
      dataIndex: "uptime",
      defaultSortOrder: getDefaultSortOrder(HostSortBy.Uptime),
      key: HostSortBy.Uptime,
      sorter: true,
      width: "10%",
      className: "cy-task-table-col-UPTIME",
      render: (_, { uptime }) =>
        uptime ? formatDistanceToNow(new Date(uptime)) : "N/A",
    },
    {
      title: "Idle Time",
      dataIndex: "totalIdleTime",
      defaultSortOrder: getDefaultSortOrder(HostSortBy.IdleTime),
      key: HostSortBy.IdleTime,
      sorter: true,
      width: "10%",
      className: "cy-task-table-col-IDLE-TIME",
      render: (_, { totalIdleTime }) =>
        totalIdleTime
          ? formatDistanceToNow(new Date(Date.now() - totalIdleTime))
          : "N/A",
    },
    {
      title: "Owner",
      dataIndex: "startedBy",
      defaultSortOrder: getDefaultSortOrder(HostSortBy.Owner),
      key: HostSortBy.Owner,
      sorter: true,
      width: "10%",
      className: "cy-task-table-col-OWNER",
      ...getColumnSearchFilterProps({
        placeholder: "Search Owner",
        value: ownerValue,
        onChange: onChangeOwner,
        "data-cy": "owner-filter",
        onFilter: updateOwnerUrlParam,
      }),
    },
  ];

  const canRestartJasperOrReprovision = (selectedHosts) => {
    let canRestart = true;
    let canReprovision = true;

    let restartJasperErrorMessage = "Jasper cannot be restarted for:";
    let reprovisionErrorMessage =
      "The following hosts cannot be reprovisioned:";
    const errorHosts = [];
    selectedHosts.forEach((host) => {
      const bootstrapMethod = host?.distro?.bootstrapMethod;
      if (
        !(
          host?.status === "running" &&
          (bootstrapMethod === "ssh" || bootstrapMethod === "user-data")
        )
      ) {
        canRestart = false;
        canReprovision = false;
        errorHosts.push(` ${host?.id}`);
      }
    });
    restartJasperErrorMessage += ` ${errorHosts}`;
    reprovisionErrorMessage += ` ${errorHosts}`;

    setCanRestartJasper(canRestart);
    setRestartJasperError(restartJasperErrorMessage);
    setCanReprovision(canReprovision);
    setReprovisionError(reprovisionErrorMessage);
  };

  const onSelectChange: TableRowSelection<Host>["onChange"] = (
    selectedRowKeys,
    selectedRows
  ) => {
    setSelectedHostIds(selectedRowKeys as string[]);
    canRestartJasperOrReprovision(selectedRows);
  };

  return (
    <Table
      data-cy="hosts-table"
      rowKey={rowKey}
      pagination={false}
      columns={columnsTemplate}
      dataSource={hosts}
      rowSelection={{
        type: "checkbox",
        onChange: onSelectChange,
        selectedRowKeys: selectedHostIds,
      }}
      getPopupContainer={(trigger: HTMLElement) => trigger}
      onChange={tableChangeHandler}
      loading={loading}
      data-loading={loading}
    />
  );
};

const rowKey = ({ id }: { id: string }): string => id;
