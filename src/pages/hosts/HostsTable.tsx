import React from "react";
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
}

type Host = HostsQuery["hosts"]["hosts"][0];

type HostsUrlParam = keyof HostsQueryVariables;

export const HostsTable: React.FC<Props> = ({
  hosts,
  sortBy,
  sortDir,
  selectedHostIds,
  setSelectedHostIds,
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
    resetHostIdUrlParam,
  ] = useTableInputFilter<HostsUrlParam>({
    urlSearchParam: "hostId",
    sendAnalyticsEvent: sendHostsTableFilterEvent,
  });

  // STATUSES URL PARAM
  const [
    statusesValue,
    onChangeStatuses,
    updateStatusesUrlParam,
    resetStatusesUrlParam,
  ] = useTableCheckboxFilter<HostsUrlParam>({
    urlSearchParam: "statuses",
    sendAnalyticsEvent: sendHostsTableFilterEvent,
  });

  // DISTRO URL PARAM
  const [
    distroIdValue,
    onChangeDistroId,
    updateDistroIdUrlParam,
    resetDistroIdUrlParam,
  ] = useTableInputFilter<HostsUrlParam>({
    urlSearchParam: "distroId",
    sendAnalyticsEvent: sendHostsTableFilterEvent,
  });

  // CURRENT TASK ID URL PARAM
  const [
    currentTaskIdValue,
    onChangeCurrentTaskId,
    updateCurrentTaskIdUrlParam,
    resetCurrentTaskIdUrlParam,
  ] = useTableInputFilter<HostsUrlParam>({
    urlSearchParam: "currentTaskId",
    sendAnalyticsEvent: sendHostsTableFilterEvent,
  });

  // OWNER URL PARAM
  const [
    ownerValue,
    onChangeOwner,
    updateOwnerUrlParam,
    resetOwnerUrlParam,
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
        dataCy: "host-id-filter",
        updateUrlParam: updateHostIdUrlParam,
        resetUrlParam: resetHostIdUrlParam,
      }),
    },
    {
      title: "Distro",
      defaultSortOrder: getDefaultSortOrder(HostSortBy.Distro),
      dataIndex: "distroId",
      key: HostSortBy.Distro,
      sorter: true,
      width: "15%",
      className: "cy-task-table-col-DISTRO",
      ...getColumnSearchFilterProps({
        placeholder: "Search Distro",
        value: distroIdValue,
        onChange: onChangeDistroId,
        dataCy: "distro-id-filter",
        updateUrlParam: updateDistroIdUrlParam,
        resetUrlParam: resetDistroIdUrlParam,
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
        updateUrlParam: updateStatusesUrlParam,
        resetUrlParam: resetStatusesUrlParam,
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
        dataCy: "current-task-id-filter",
        updateUrlParam: updateCurrentTaskIdUrlParam,
        resetUrlParam: resetCurrentTaskIdUrlParam,
      }),
    },
    {
      title: "Elapsed",
      defaultSortOrder: getDefaultSortOrder(HostSortBy.Elapsed),
      dataIndex: "elapsed",
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
      defaultSortOrder: getDefaultSortOrder(HostSortBy.IdleTime),
      dataIndex: "totalIdleTime",
      key: HostSortBy.IdleTime,
      sorter: true,
      width: "10%",
      className: "cy-task-table-col-IDLE-TIME",
      render: (_, { totalIdleTime }) =>
        totalIdleTime ? formatDistanceToNow(new Date(totalIdleTime)) : "N/A",
    },
    {
      title: "Owner",
      defaultSortOrder: getDefaultSortOrder(HostSortBy.Owner),
      dataIndex: "startedBy",
      key: HostSortBy.Owner,
      sorter: true,
      width: "10%",
      className: "cy-task-table-col-OWNER",
      ...getColumnSearchFilterProps({
        placeholder: "Search Owner",
        value: ownerValue,
        onChange: onChangeOwner,
        dataCy: "owner-filter",
        updateUrlParam: updateOwnerUrlParam,
        resetUrlParam: resetOwnerUrlParam,
      }),
    },
  ];

  const onSelectChange: TableRowSelection<Host>["onChange"] = (
    selectedRowKeys
  ) => setSelectedHostIds(selectedRowKeys as string[]);

  return (
    <Table
      data-test-id="hosts-table"
      rowKey={rowKey}
      pagination={false}
      columns={columnsTemplate}
      dataSource={hosts}
      rowSelection={{
        type: "checkbox",
        onChange: onSelectChange,
        selectedRowKeys: selectedHostIds,
      }}
      onChange={tableChangeHandler}
      loading={loading}
    />
  );
};

const rowKey = ({ id }: { id: string }): string => id;
