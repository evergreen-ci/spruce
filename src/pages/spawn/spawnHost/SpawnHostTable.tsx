import React from "react";
import styled from "@emotion/styled";
import { Table } from "antd";
import { formatDistanceToNow } from "date-fns";
import { HostStatusBadge } from "components/HostStatusBadge";
import Button, { Size } from "@leafygreen-ui/button";
import Tooltip from "@leafygreen-ui/tooltip";
import { Host } from "gql/generated/types";
import Icon from "components/icons/Icon";
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

      render: (uptime) =>
        formatDistanceToNow(new Date(uptime)) || "Does not expire",
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
    <PaddedButton glyph={<Icon glyph="Trash" />} size={Size.Small} />
    <CopySSHCommandButton host={host} />
    <PaddedButton size={Size.Small}>Edit</PaddedButton>
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
          size={Size.Small}
        >
          Copy SSH command
        </PaddedButton>
      }
      triggerEvent="click"
      variant="dark"
    >
      Copied!
    </Tooltip>
  );
};
const ActionButtonContainer = styled.div`
  display: flex;
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
