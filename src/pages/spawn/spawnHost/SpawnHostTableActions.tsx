import React from "react";
import styled from "@emotion/styled";
import Button, { Size } from "@leafygreen-ui/button";
import { Tooltip } from "antd";
import Icon from "components/icons/Icon";
import { Host } from "gql/generated/types";
import { copyToClipboard } from "utils/string";
import { EditSpawnHostButton } from "./EditSpawnHostButton";
import { SpawnHostActionButton } from "./SpawnHostActionButton";

export const SpawnHostTableActions: React.FC<{ host: Host }> = ({ host }) => (
  <ActionButtonContainer>
    <SpawnHostActionButton host={host} />
    <PaddedButton glyph={<Icon glyph="Trash" />} size={Size.XSmall} />
    <CopySSHCommandButton host={host} />
    <EditSpawnHostButton host={host} />
  </ActionButtonContainer>
);

const CopySSHCommandButton: React.FC<{ host: Host }> = ({ host }) => {
  const sshCommand = `ssh ${host.user}@${host.hostUrl}`;

  return (
    <Tooltip placement="top" title="Copied!" trigger="click">
      <PaddedButton
        onClick={() => {
          copyToClipboard(sshCommand);
        }}
        size={Size.XSmall}
      >
        Copy SSH command
      </PaddedButton>
    </Tooltip>
  );
};

const FlexContainer = styled.div`
  display: flex;
  justify-content: space-between;
`;

const ActionButtonContainer = styled(FlexContainer)`
  flex-shrink: 0;
`;

const PaddedButton = styled(Button)`
  margin-left: 5px;
  margin-right: 5px;
`;
