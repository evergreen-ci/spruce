import React from "react";
import styled from "@emotion/styled";
import { Size } from "@leafygreen-ui/button";
import Tooltip from "@leafygreen-ui/tooltip";
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
    <FlexContainer onClick={(e: React.MouseEvent) => e.stopPropagation()}>
      <Tooltip
        align="top"
        justify="middle"
        triggerEvent="click"
        trigger={
          <PaddedButton // @ts-expect-error
            onClick={() => {
              copyToClipboard(sshCommand);
              spawnAnalytics.sendEvent({ name: "Copy SSH Command" });
            }}
            size={Size.XSmall}
          >
            <Label>Copy SSH command</Label>
          </PaddedButton>
        }
      >
        <Center>Copied!</Center>
        <Center>Must be on VPN to connect to host</Center>
      </Tooltip>
    </FlexContainer>
  );
};

const FlexContainer = styled.div`
  display: flex;
`;

const Label = styled.div`
  width: 121px;
`;

const Center = styled.div`
  text-align: center;
`;
