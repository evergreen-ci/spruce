import { Table } from "antd";
import { ColumnProps } from "antd/es/table";
import { TableRowSelection } from "antd/es/table/interface";
import { formatDistanceToNow } from "date-fns";
import { useHostsTableAnalytics } from "analytics";
import { StyledRouterLink, WordBreak } from "components/styles";
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
  loading,
  selectedHostIds,
  setCanReprovision,
  setCanRestartJasper,
  setReprovisionError,
  setRestartJasperError,
  setSelectedHostIds,
  sortBy,
  sortDir,
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
    hostsTableAnalytics.sendEvent({ filterBy, name: "Filter Hosts" });

  // HOST ID URL PARAM
  const [hostIdValue, onChangeHostId, updateHostIdUrlParam] =
    useTableInputFilter<HostsUrlParam>({
      sendAnalyticsEvent: sendHostsTableFilterEvent,
      urlSearchParam: "hostId",
    });

  // STATUSES URL PARAM
  const [statusesValue, onChangeStatuses] =
    useTableCheckboxFilter<HostsUrlParam>({
      sendAnalyticsEvent: sendHostsTableFilterEvent,
      urlSearchParam: "statuses",
    });

  // DISTRO URL PARAM
  const [distroIdValue, onChangeDistroId, updateDistroIdUrlParam] =
    useTableInputFilter<HostsUrlParam>({
      sendAnalyticsEvent: sendHostsTableFilterEvent,
      urlSearchParam: "distroId",
    });

  // CURRENT TASK ID URL PARAM
  const [
    currentTaskIdValue,
    onChangeCurrentTaskId,
    updateCurrentTaskIdUrlParam,
  ] = useTableInputFilter<HostsUrlParam>({
    sendAnalyticsEvent: sendHostsTableFilterEvent,
    urlSearchParam: "currentTaskId",
  });

  // OWNER URL PARAM
  const [ownerValue, onChangeOwner, updateOwnerUrlParam] =
    useTableInputFilter<HostsUrlParam>({
      sendAnalyticsEvent: sendHostsTableFilterEvent,
      urlSearchParam: "startedBy",
    });

  // TABLE COLUMNS
  const columnsTemplate: Array<ColumnProps<Host>> = [
    {
      className: "cy-hosts-table-col-ID",
      dataIndex: "id",
      defaultSortOrder: getDefaultSortOrder(HostSortBy.Id),
      key: HostSortBy.Id,
      render: (_, { id }: Host): JSX.Element => (
        <StyledRouterLink data-cy="host-id-link" to={getHostRoute(id)}>
          {id}
        </StyledRouterLink>
      ),
      sorter: true,
      title: "ID",
      width: "17%",
      ...getColumnSearchFilterProps({
        "data-cy": "host-id-filter",
        onChange: onChangeHostId,
        onFilter: updateHostIdUrlParam,
        placeholder: "Search ID",
        value: hostIdValue,
      }),
    },
    {
      className: "cy-task-table-col-DISTRO",
      dataIndex: "distroId",
      defaultSortOrder: getDefaultSortOrder(HostSortBy.Distro),
      key: HostSortBy.Distro,
      sorter: true,
      title: "Distro",
      width: "15%",
      ...getColumnSearchFilterProps({
        "data-cy": "distro-id-filter",
        onChange: onChangeDistroId,
        onFilter: updateDistroIdUrlParam,
        placeholder: "Search distro regex",
        value: distroIdValue,
      }),
    },
    {
      className: "cy-task-table-col-STATUS",
      dataIndex: "status",
      defaultSortOrder: getDefaultSortOrder(HostSortBy.Status),
      key: HostSortBy.Status,
      sorter: true,
      title: "Status",
      width: "10%",
      ...getColumnCheckboxFilterProps({
        dataCy: "statuses-filter",
        onChange: onChangeStatuses,
        statuses: hostStatuses,
        value: statusesValue,
      }),
    },
    {
      className: "cy-task-table-col-CURRENT-TASK",
      dataIndex: "currentTask",
      defaultSortOrder: getDefaultSortOrder(HostSortBy.CurrentTask),
      key: HostSortBy.CurrentTask,
      render: (_, { runningTask }: Host) =>
        runningTask?.id !== null ? (
          <StyledRouterLink
            data-cy="current-task-link"
            to={getTaskRoute(runningTask?.id)}
          >
            <WordBreak>{runningTask?.name}</WordBreak>
          </StyledRouterLink>
        ) : (
          ""
        ),
      sorter: true,
      title: "Current Task",
      width: "18%",
      ...getColumnSearchFilterProps({
        "data-cy": "current-task-id-filter",
        onChange: onChangeCurrentTaskId,
        onFilter: updateCurrentTaskIdUrlParam,
        placeholder: "Search Current Task ID",
        value: currentTaskIdValue,
      }),
    },
    {
      className: "cy-task-table-col-ELAPSED",
      dataIndex: "elapsed",
      defaultSortOrder: getDefaultSortOrder(HostSortBy.Elapsed),
      key: HostSortBy.Elapsed,
      render: (_, { elapsed }) =>
        elapsed ? formatDistanceToNow(new Date(elapsed)) : "N/A",
      sorter: true,
      title: "Elapsed",
      width: "10%",
    },
    {
      className: "cy-task-table-col-UPTIME",
      dataIndex: "uptime",
      defaultSortOrder: getDefaultSortOrder(HostSortBy.Uptime),
      key: HostSortBy.Uptime,
      render: (_, { uptime }) =>
        uptime ? formatDistanceToNow(new Date(uptime)) : "N/A",
      sorter: true,
      title: "Uptime",
      width: "10%",
    },
    {
      className: "cy-task-table-col-IDLE-TIME",
      dataIndex: "totalIdleTime",
      defaultSortOrder: getDefaultSortOrder(HostSortBy.IdleTime),
      key: HostSortBy.IdleTime,
      render: (_, { totalIdleTime }) =>
        totalIdleTime
          ? formatDistanceToNow(new Date(Date.now() - totalIdleTime))
          : "N/A",
      sorter: true,
      title: "Idle Time",
      width: "10%",
    },
    {
      className: "cy-task-table-col-OWNER",
      dataIndex: "startedBy",
      defaultSortOrder: getDefaultSortOrder(HostSortBy.Owner),
      key: HostSortBy.Owner,
      render: (owner) => <WordBreak>{owner}</WordBreak>,
      sorter: true,
      title: "Owner",
      width: "10%",
      ...getColumnSearchFilterProps({
        "data-cy": "owner-filter",
        onChange: onChangeOwner,
        onFilter: updateOwnerUrlParam,
        placeholder: "Search Owner",
        value: ownerValue,
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
        onChange: onSelectChange,
        selectedRowKeys: selectedHostIds,
        type: "checkbox",
      }}
      getPopupContainer={(trigger: HTMLElement) => trigger}
      onChange={tableChangeHandler}
      loading={loading}
      data-loading={loading}
    />
  );
};

const rowKey = ({ id }: { id: string }): string => id;
