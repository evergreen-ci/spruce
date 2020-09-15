import React from "react";
import styled from "@emotion/styled";
import Badge from "@leafygreen-ui/badge";
import { formatDistanceToNow } from "date-fns";
import { useLocation } from "react-router";
import { HostStatusBadge } from "components/HostStatusBadge";
import { Host, Maybe } from "gql/generated/types";
import { parseQueryString } from "utils";
import { sortFunctionDate, sortFunctionString } from "utils/string";
import { SpawnHostCard } from "./SpawnHostCard";
import { SpawnHostTableActions } from "./SpawnHostTableActions";
import { SpawnTable } from "components/Spawn";

interface SpawnHostTableProps {
  hosts: Array<Host>;
}
export const SpawnHostTable: React.FC<SpawnHostTableProps> = ({ hosts }) => {
  const { search } = useLocation();
  const host = parseQueryString(search)?.host;
  return (
    <SpawnTable
      columns={columns}
      dataSource={hosts}
      expandedRowRender={(record: Host) => <SpawnHostCard host={record} />}
      defaultExpandedRowKeys={[host as string]}
    />
  );
};

const columns = [
  {
    title: "Host",
    dataIndex: "id",
    key: "host",
    sorter: (a: Host, b: Host) => sortFunctionString(a, b, "id"),
    render: (_, host: Host) =>
      host?.distro?.isVirtualWorkStation ? (
        <FlexContainer>
          <HostIdSpan>{host.id}</HostIdSpan>
          <WorkstationBadge>WORKSTATION</WorkstationBadge>
        </FlexContainer>
      ) : (
        <HostIdSpan>{host.id}</HostIdSpan>
      ),
  },
  {
    title: "Distro",
    dataIndex: "distro",
    key: "distro",
    width: 100,
    sorter: (a: Host, b: Host) => sortFunctionString(a, b, "distro.id"),
    render: (distro) => distro.id,
  },
  {
    title: "Status",
    dataIndex: "status",
    key: "status",
    sorter: (a: Host, b: Host) => sortFunctionString(a, b, "status"),
    render: (status) => <HostStatusBadge status={status} />,
  },
  {
    title: "Expires In",
    dataIndex: "expiration",
    key: "expiration",
    sorter: (a: Host, b: Host) => sortFunctionDate(a, b, "expiration"),
    render: (expiration, host: Host) =>
      host?.noExpiration
        ? "Does not expire"
        : formatDistanceToNow(new Date(expiration)),
  },
  {
    title: "Uptime",
    dataIndex: "uptime",
    key: "uptime",

    sorter: (a: Host, b: Host) => sortFunctionDate(a, b, "uptime"),
    render: (uptime) => formatDistanceToNow(new Date(uptime)),
  },
  {
    title: "Action",
    key: "action",
    render: (_, host) => <SpawnHostTableActions host={host} />,
  },
];

const FlexContainer = styled.div`
  display: flex;
  justify-content: space-between;
`;

const WorkstationBadge = styled(Badge)`
  margin-left: 5px;
`;

const HostIdSpan = styled.span`
  white-space: nowrap;
  word-break: break-all;
  overflow: scroll;
  width: 150px;
`;
