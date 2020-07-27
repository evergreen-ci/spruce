import React from "react";
import { ColumnProps } from "antd/es/table";
import { Table } from "antd";
import { Host, HostsQueryVariables } from "gql/generated/types";
import { formatDistanceToNow } from "date-fns";
import { StyledRouterLink } from "components/styles";
import { useTableInputFilter, useTableTreeSelectFilter } from "hooks";
import { getHostRoute, getTaskRoute } from "constants/routes";
import {
  getColumnSearchFilterProps,
  getColumnTreeSelectFilterProps,
} from "utils/filters";
import { statusesTreeData } from "constants/hosts";

interface Props {
  hosts: Host[];
}

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

type HostsUrlParam = keyof HostsQueryVariables;

export const HostsTable: React.FC<Props> = ({ hosts }) => {
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
  ] = useTableTreeSelectFilter<HostsUrlParam>({
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
      dataIndex: "distroId",
      key: TableColumnHeader.Distro,
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
      key: TableColumnHeader.Status,
      sorter: true,
      className: "cy-task-table-col-STATUS",
      ...getColumnTreeSelectFilterProps({
        value: statusesValue,
        onChange: onChangeStatuses,
        dataCy: "statuses-filter",
        statuses: statusesTreeData,
        updateUrlParam: updateStatusesUrlParam,
        resetUrlParam: resetStatusesUrlParam,
      }),
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

  return (
    <Table
      data-test-id="tasks-table"
      rowKey={rowKey}
      pagination={false}
      columns={columnsTemplate}
      dataSource={hosts}
      onChange={() => undefined}
    />
  );
};

const rowKey = ({ id }: { id: string }): string => id;
