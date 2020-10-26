import React from "react";
import styled from "@emotion/styled";
import Button, { Size } from "@leafygreen-ui/button";
import { Tooltip } from "antd";
import { useSpawnAnalytics } from "analytics";
import { MyHost } from "types/spawn";
import { copyToClipboard } from "utils/string";
import { EditSpawnHostButton } from "./EditSpawnHostButton";
import { SpawnHostActionButton } from "./SpawnHostActionButton";

export const SpawnHostTableActions: React.FC<{ host: MyHost }> = ({ host }) => (
  <FlexContainer>
    <SpawnHostActionButton host={host} />
    <CopySSHCommandButton host={host} />
    <EditSpawnHostButton host={host} />
  </FlexContainer>
);

const CopySSHCommandButton: React.FC<{ host: MyHost }> = ({ host }) => {
  const sshCommand = `ssh ${host.user}@${host.hostUrl}`;
  const spawnAnalytics = useSpawnAnalytics();

  return (
    <Tooltip placement="top" title="Copied!" trigger="click">
      <PaddedButton
        onClick={(e: React.MouseEvent) => {
          e.stopPropagation();
          copyToClipboard(sshCommand);
          spawnAnalytics.sendEvent({ name: "Copy SSH Command" });
        }}
        size={Size.XSmall}
      >
        <Label>Copy SSH command</Label>
      </PaddedButton>
    </Tooltip>
  );
};

const FlexContainer = styled.div`
  display: flex;
`;

const Label = styled.div`
  width: 121px;
`;

const PaddedButton = styled(Button)`
  margin-left: 5px;
  margin-right: 5px;
`;
