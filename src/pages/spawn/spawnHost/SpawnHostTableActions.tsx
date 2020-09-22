import React from "react";
import styled from "@emotion/styled";
import Button, { Size } from "@leafygreen-ui/button";
import { Tooltip } from "antd";
import Icon from "components/icons/Icon";
import { copyToClipboard } from "utils/string";
import { EditSpawnHostButton } from "./EditSpawnHostButton";
import { SpawnHostActionButton } from "./SpawnHostActionButton";
import { MyHost } from "./types";

export const SpawnHostTableActions: React.FC<{ host: MyHost }> = ({ host }) => (
  <FlexContainer>
    <SpawnHostActionButton host={host} />
    <PaddedButton glyph={<Icon glyph="Trash" />} size={Size.XSmall} />
    <CopySSHCommandButton host={host} />
    <EditSpawnHostButton host={host} />
  </FlexContainer>
);

const CopySSHCommandButton: React.FC<{ host: MyHost }> = ({ host }) => {
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
`;

const PaddedButton = styled(Button)`
  margin-left: 5px;
  margin-right: 5px;
  flex-grow: 0;
`;
