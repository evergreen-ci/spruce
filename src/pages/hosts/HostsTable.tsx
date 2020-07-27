import React from "react";
import { ColumnProps } from "antd/es/table";
import { Table, Input, Icon } from "antd";
import { Host, HostsQueryVariables } from "gql/generated/types";
import { Button } from "components/Button";
import { formatDistanceToNow } from "date-fns";
import { TreeDataEntry, renderCheckboxes } from "components/TreeSelect";
import { StyledRouterLink } from "components/styles";
import { useTableInputFilter, useTableTreeSelectFilter } from "hooks";
import { getHostRoute, getTaskRoute } from "constants/routes";

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

enum HostStatus {
  Running = "running",
  Terminated = "terminated",
  Uninitialized = "initializing",
  Building = "building",
  Starting = "starting",
  Provisioning = "provisioning",
  ProvisionFailed = "provision failed",
  Quarantined = "quarantined",
  Decommissioned = "decommissioned",
}

export interface Status {
  title: keyof typeof HostStatus;
  value: HostStatus;
  key: HostStatus;
}

const statusesTreeData: Status[] = [
  {
    title: "Running",
    value: HostStatus.Running,
    key: HostStatus.Running,
  },
  {
    title: "Terminated",
    value: HostStatus.Terminated,
    key: HostStatus.Terminated,
  },
  {
    title: "Uninitialized",
    value: HostStatus.Uninitialized,
    key: HostStatus.Uninitialized,
  },

  {
    title: "Building",
    value: HostStatus.Building,
    key: HostStatus.Building,
  },
  {
    title: "Starting",
    value: HostStatus.Starting,
    key: HostStatus.Starting,
  },
  {
    title: "Provisioning",
    value: HostStatus.Provisioning,
    key: HostStatus.Provisioning,
  },
  {
    title: "ProvisionFailed",
    value: HostStatus.ProvisionFailed,
    key: HostStatus.ProvisionFailed,
  },
  {
    title: "Quarantined",
    value: HostStatus.Quarantined,
    key: HostStatus.Quarantined,
  },
  {
    title: "Decommissioned",
    value: HostStatus.Decommissioned,
    key: HostStatus.Decommissioned,
  },
];

interface SearchFilterParams {
  dataCy: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  updateUrlParam: () => void;
  resetUrlParam: () => void;
}

const getColumnSearchFilterProps = ({
  dataCy,
  placeholder,
  value,
  onChange,
  updateUrlParam,
  resetUrlParam,
}: SearchFilterParams) => ({
  filterDropdown: () => (
    <div style={{ padding: 8 }}>
      <Input
        data-cy={dataCy}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
      <Button size="small" onClick={resetUrlParam}>
        Reset
      </Button>
      <Button size="small" variant="primary" onClick={updateUrlParam}>
        Search
      </Button>
    </div>
  ),
  filterIcon: () => (
    <Icon type="search" style={{ color: value ? "#1890ff" : undefined }} />
  ),
});

interface TreeSelectFilterParams<TreeData> {
  dataCy: string;
  statuses: TreeData;
  value: string[];
  onChange: (v: string[]) => void;
  updateUrlParam: () => void;
  resetUrlParam: () => void;
}

const getColumnTreeSelectFilterProps = <TreeData extends TreeDataEntry[]>({
  statuses,
  value,
  onChange,
  updateUrlParam,
  resetUrlParam,
}: TreeSelectFilterParams<TreeData>) => ({
  filterDropdown: () => (
    <div style={{ padding: 8 }}>
      {renderCheckboxes({
        tData: statuses,
        state: value,
        onChange,
        hasParent: false,
      })}
      <Button onClick={resetUrlParam} size="small">
        Reset
      </Button>
      <Button size="small" variant="primary" onClick={updateUrlParam}>
        Search
      </Button>
    </div>
  ),
  filterIcon: () => (
    <Icon
      type="filter"
      style={{ color: value.length ? "#1890ff" : undefined }}
    />
  ),
});

const rowKey = ({ id }: { id: string }): string => id;
