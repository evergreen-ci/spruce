import React from "react";
import styled from "@emotion/styled";
import Badge from "@leafygreen-ui/badge";
import { formatDistanceToNow } from "date-fns";
import { useLocation } from "react-router";
import { HostStatusBadge } from "components/HostStatusBadge";
import { DoesNotExpire, SpawnTable } from "components/Spawn";
import { MyHost } from "types/spawn";
import { parseQueryString } from "utils";
import { sortFunctionDate, sortFunctionString } from "utils/string";
import { SpawnHostCard } from "./SpawnHostCard";
import { SpawnHostTableActions } from "./SpawnHostTableActions";

interface SpawnHostTableProps {
  hosts: MyHost[];
}
export const SpawnHostTable: React.FC<SpawnHostTableProps> = ({ hosts }) => {
  const { search } = useLocation();
  const host = parseQueryString(search)?.host;
  return (
    <SpawnTable
      columns={columns}
      dataSource={hosts}
      expandedRowRender={(record: MyHost) => <SpawnHostCard host={record} />}
      defaultExpandedRowKeys={[host as string]}
    />
  );
};

const columns = [
  {
    title: "Host",
    dataIndex: "id",
    key: "host",
    sorter: (a: MyHost, b: MyHost) => sortFunctionString(a, b, "id"),
    render: (_, host: MyHost) =>
      host?.distro?.isVirtualWorkStation ? (
        <FlexContainer>
          <HostIdSpan>{host.displayName || host.id}</HostIdSpan>
          <WorkstationBadge>WORKSTATION</WorkstationBadge>
        </FlexContainer>
      ) : (
        <HostIdSpan>{host.displayName || host.id}</HostIdSpan>
      ),
  },
  {
    title: "Distro",
    dataIndex: "distro",
    key: "distro",
    width: 100,
    sorter: (a: MyHost, b: MyHost) => sortFunctionString(a, b, "distro.id"),
    render: (distro) => distro.id,
  },
  {
    title: "Status",
    dataIndex: "status",
    key: "status",
    sorter: (a: MyHost, b: MyHost) => sortFunctionString(a, b, "status"),
    render: (status) => <HostStatusBadge status={status} />,
  },
  {
    title: "Expires In",
    dataIndex: "expiration",
    key: "expiration",
    sorter: (a: MyHost, b: MyHost) => sortFunctionDate(a, b, "expiration"),
    render: (expiration, host: MyHost) =>
      host?.noExpiration
        ? DoesNotExpire
        : formatDistanceToNow(new Date(expiration)),
  },
  {
    title: "Uptime",
    dataIndex: "uptime",
    key: "uptime",

    sorter: (a: MyHost, b: MyHost) => sortFunctionDate(a, b, "uptime"),
    render: (uptime) => formatDistanceToNow(new Date(uptime)),
  },
  {
    title: "Action",
    key: "action",
    render: (_, host: MyHost) => <SpawnHostTableActions host={host} />,
  },
];

const FlexContainer = styled.div`
  display: flex;
  justify-content: space-between;
`;

const WorkstationBadge = styled(Badge)`
  margin-left: 5px;
`;

const HostIdSpan = styled.div`
  white-space: nowrap;
  word-break: break-all;
  overflow: scroll;
  width: 160px;
`;
