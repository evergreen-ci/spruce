import React from "react";
import { ColumnProps } from "antd/es/table";
import { Table } from "antd";
import {
  Host,
  HostsQueryVariables,
  SortDirection,
  HostSortBy,
} from "gql/generated/types";
import { formatDistanceToNow } from "date-fns";
import { StyledRouterLink } from "components/styles";
import { getHostRoute, getTaskRoute } from "constants/routes";
import {
  getColumnSearchFilterProps,
  getColumnCheckboxFilterProps,
} from "components/Table/Filters";
import { hostStatuses } from "constants/hosts";
import {
  useUpdateUrlSortParamOnTableChange,
  useTableInputFilter,
  useTableCheckboxFilter,
} from "hooks";

interface Props {
  hosts: Host[];
  sortBy: HostsQueryVariables["sortBy"];
  sortDir: HostsQueryVariables["sortDir"];
  setSelectedHosts: React.Dispatch<React.SetStateAction<Host[]>>;
}

type HostsUrlParam = keyof HostsQueryVariables;

export const HostsTable: React.FC<Props> = ({
  hosts,
  sortBy,
  sortDir,
  setSelectedHosts,
}) => {
  const tableChangeHandler = useUpdateUrlSortParamOnTableChange<Host>();

  const getDefaultSortOrder = (
    key: HostSortBy
  ): ColumnProps<Host>["defaultSortOrder"] => {
    if (sortBy === key) {
      return sortDir === SortDirection.Asc ? "ascend" : "descend";
    }
    return null;
  };

  // HOST ID URL PARAM
  const [
    hostIdValue,
    onChangeHostId,
    updateHostIdUrlParam,
    resetHostIdUrlParam,
  ] = useTableInputFilter<HostsUrlParam>({
    urlSearchParam: "hostId",
    sendAnalyticsEvent: () => undefined,
  });

  // STATUSES URL PARAM
  const [
    statusesValue,
    onChangeStatuses,
    updateStatusesUrlParam,
    resetStatusesUrlParam,
  ] = useTableCheckboxFilter<HostsUrlParam>({
    urlSearchParam: "statuses",
    sendAnalyticsEvent: () => undefined,
  });

  // DISTRO URL PARAM
  const [
    distroIdValue,
    onChangeDistroId,
    updateDistroIdUrlParam,
    resetDistroIdUrlParam,
  ] = useTableInputFilter<HostsUrlParam>({
    urlSearchParam: "distroId",
    sendAnalyticsEvent: () => undefined,
  });

  // CURRENT TASK ID URL PARAM
  const [
    currentTaskIdValue,
    onChangeCurrentTaskId,
    updateCurrentTaskIdUrlParam,
    resetCurrentTaskIdUrlParam,
  ] = useTableInputFilter<HostsUrlParam>({
    urlSearchParam: "currentTaskId",
    sendAnalyticsEvent: () => undefined,
  });

  // OWNER URL PARAM
  const [
    ownerValue,
    onChangeOwner,
    updateOwnerUrlParam,
    resetOwnerUrlParam,
  ] = useTableInputFilter<HostsUrlParam>({
    urlSearchParam: "startedBy",
    sendAnalyticsEvent: () => undefined,
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
      render: (_, { elapsed }) =>
        elapsed ? formatDistanceToNow(new Date(elapsed)) : "N/A",
    },
    {
      title: "Uptime",
      dataIndex: "uptime",
      defaultSortOrder: getDefaultSortOrder(HostSortBy.Uptime),
      key: HostSortBy.Uptime,
      sorter: true,
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

  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      console.log(
        `selectedRowKeys: ${selectedRowKeys}`,
        "selectedRows: ",
        selectedRows
      );
      setSelectedHosts(selectedRows);
    },
  };

  return (
    <Table
      data-test-id="hosts-table"
      rowKey={rowKey}
      pagination={false}
      columns={columnsTemplate}
      dataSource={hosts}
      rowSelection={{
        type: "checkbox",
        ...rowSelection,
      }}
      onChange={tableChangeHandler}
    />
  );
};

const rowKey = ({ id }: { id: string }): string => id;
