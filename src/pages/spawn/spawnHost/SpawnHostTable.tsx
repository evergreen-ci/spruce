import React from "react";
import styled from "@emotion/styled";
import Badge from "@leafygreen-ui/badge";
import Button, { Size } from "@leafygreen-ui/button";
import Tooltip from "@leafygreen-ui/tooltip";
import { Table } from "antd";
import { formatDistanceToNow } from "date-fns";
import { HostStatusBadge } from "components/HostStatusBadge";
import Icon from "components/icons/Icon";
import { Host } from "gql/generated/types";
import {
  copyToClipboard,
  sortFunctionDate,
  sortFunctionString,
} from "utils/string";
import { SpawnHostActionButton } from "./SpawnHostActionButton";

interface SpawnHostTableProps {
  hosts: Host[];
}
export const SpawnHostTable: React.FC<SpawnHostTableProps> = ({ hosts }) => {
  const columns = [
    {
      title: "Host",
      dataIndex: "id",
      key: "host",
      sorter: (a, b) => sortFunctionString(a, b, "id"),
      render: (_, host: Host) => <HostIdField host={host} />,
    },
    {
      title: "Distro",
      dataIndex: "distro",
      key: "distro",
      sorter: (a, b) => sortFunctionString(a, b, "distro.id"),
      render: (distro) => distro.id,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      sorter: (a, b) => sortFunctionString(a, b, "status"),
      render: (status) => <HostStatusBadge status={status} />,
    },
    {
      title: "Expires In",
      dataIndex: "expiration",
      key: "expiration",
      sorter: (a, b) => sortFunctionDate(a, b, "expiration"),
      render: (expiration) =>
        formatDistanceToNow(new Date(expiration)) || "Does not expire",
    },
    {
      title: "Uptime",
      dataIndex: "uptime",
      key: "uptime",
      sorter: (a, b) => sortFunctionDate(a, b, "uptime"),
      render: (uptime) => formatDistanceToNow(new Date(uptime)),
    },
    {
      title: "Action",
      key: "action",
      render: (_, host) => <SpawnHostActions host={host} />,
    },
  ];
  return (
    <Container>
      <Table
        columns={columns}
        dataSource={hosts}
        rowKey={(record) => record.id}
        pagination={false}
      />
    </Container>
  );
};

const SpawnHostActions: React.FC<{ host: Host }> = ({ host }) => (
  <ActionButtonContainer>
    <SpawnHostActionButton host={host} />
    <PaddedButton glyph={<Icon glyph="Trash" />} size={Size.XSmall} />
    <CopySSHCommandButton host={host} />
    <PaddedButton size={Size.XSmall}>Edit</PaddedButton>
  </ActionButtonContainer>
);

const CopySSHCommandButton: React.FC<{ host: Host }> = ({ host }) => {
  const sshCommand = `${host.user}@${host.hostUrl}`;

  return (
    <Tooltip
      align="top"
      justify="middle"
      trigger={
        <PaddedButton
          onClick={() => copyToClipboard(sshCommand)}
          size={Size.XSmall}
        >
          Copy SSH command
        </PaddedButton>
      }
      triggerEvent="click"
      variant="light"
    >
      Copied!
    </Tooltip>
  );
};

const HostIdField: React.FC<{ host: Host }> = ({ host }) => {
  const isVirtualWorkStation = host?.distro?.isVirtualWorkStation;
  return isVirtualWorkStation ? (
    <FlexContainer>
      <HostIdSpan>{host.id}</HostIdSpan>
      <WorkstationBadge>WORKSTATION</WorkstationBadge>
    </FlexContainer>
  ) : (
    <HostIdSpan>{host.id}</HostIdSpan>
  );
};

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

const ActionButtonContainer = styled(FlexContainer)`
  flex-shrink: 0;
`;

const PaddedButton = styled(Button)`
  margin-left: 5px;
  margin-right: 5px;
`;

const Container = styled.div`
  width: 100%;
  padding-right: 1%;
`;
