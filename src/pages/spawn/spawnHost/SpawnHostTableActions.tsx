import React, { useState, useEffect } from "react";
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
    <CopySSHCommandButton user={host.user} hostUrl={host.hostUrl} />
    <EditSpawnHostButton host={host} />
  </FlexContainer>
);

export const CopySSHCommandButton: React.FC<{
  user: string;
  hostUrl: string;
}> = ({ user, hostUrl }) => {
  const sshCommand = `ssh ${user}@${hostUrl}`;
  const spawnAnalytics = useSpawnAnalytics();
  const [hasCopied, setHasCopied] = useState(false);
  const [openTooltip, setOpenTooltip] = useState(false);
  useEffect(() => {
    const timeout = setTimeout(() => setHasCopied(false), 10000);
    return () => clearTimeout(timeout);
  }, [hasCopied]);

  return (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
    <div
      onClick={(e: React.MouseEvent) => e.stopPropagation()}
      onMouseEnter={() => {
        setOpenTooltip(true);
      }}
      onMouseLeave={() => {
        setOpenTooltip(false);
      }}
    >
      <Tooltip
        align="top"
        justify="middle"
        enabled
        open={openTooltip}
        data-cy="copy-ssh-tooltip"
        trigger={
          <PaddedButton // @ts-expect-error
            onClick={() => {
              copyToClipboard(sshCommand);
              spawnAnalytics.sendEvent({ name: "Copy SSH Command" });
              setHasCopied(!hasCopied);
            }}
            size={Size.XSmall}
            data-cy="copy-ssh-button"
          >
            <Label>Copy SSH command</Label>
          </PaddedButton>
        }
      >
        {hasCopied ? (
          <Center>Copied!</Center>
        ) : (
          <Center>Must be on VPN to connect to host</Center>
        )}
      </Tooltip>
    </div>
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
