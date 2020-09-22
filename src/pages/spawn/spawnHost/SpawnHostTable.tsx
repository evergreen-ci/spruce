import React from "react";
import styled from "@emotion/styled";
import Badge from "@leafygreen-ui/badge";
import { Table } from "antd";
import { formatDistanceToNow } from "date-fns";
import { useLocation } from "react-router";
import { HostStatusBadge } from "components/HostStatusBadge";
import Icon from "components/icons/Icon";
import { MyHostsQuery } from "gql/generated/types";
import { parseQueryString } from "utils";
import { sortFunctionDate, sortFunctionString } from "utils/string";
import { SpawnHostCard } from "./SpawnHostCard";
import { SpawnHostTableActions } from "./SpawnHostTableActions";
import { MyHost } from "./types";

interface SpawnHostTableProps {
  hosts: MyHostsQuery["myHosts"];
}
export const SpawnHostTable: React.FC<SpawnHostTableProps> = ({ hosts }) => {
  const { search } = useLocation();
  const queryParams = parseQueryString(search);
  const host = queryParams?.host;
  return (
    <Container>
      <Table
        columns={columns}
        dataSource={hosts}
        rowKey={(record) => record.id}
        pagination={false}
        expandedRowRender={(record: MyHost) => <SpawnHostCard host={record} />}
        expandIcon={({ expanded }) => (
          <Icon glyph={expanded ? "CaretDown" : "CaretRight"} />
        )}
        defaultExpandedRowKeys={[host as string]}
        expandRowByClick
      />
    </Container>
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
        ? "Does not expire"
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

const HostIdSpan = styled.span`
  white-space: nowrap;
  word-break: break-all;
  overflow: scroll;
  width: 150px;
`;

const Container = styled.div`
  width: 100%;
  padding-right: 1%;
`;
