import React from "react";
import styled from "@emotion/styled";
import { Size } from "@leafygreen-ui/button";
import { Tooltip } from "antd";
import { useSpawnAnalytics } from "analytics";
import { PaddedButton } from "components/Spawn";
import { MyHost } from "types/spawn";
import { string } from "utils";
import { EditSpawnHostButton } from "./EditSpawnHostButton";
import { SpawnHostActionButton } from "./SpawnHostActionButton";

const { copyToClipboard } = string;

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
      <PaddedButton // @ts-expect-error
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
