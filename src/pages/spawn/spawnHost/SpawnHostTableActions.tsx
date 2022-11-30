import { useState, useEffect } from "react";
import styled from "@emotion/styled";
import { Size } from "@leafygreen-ui/button";
import Tooltip from "@leafygreen-ui/tooltip";
import { useSpawnAnalytics } from "analytics";
import Icon from "components/Icon";
import { PaddedButton, tooltipWidth } from "components/Spawn";
import { SECOND } from "constants/index";
import { HostStatus } from "types/host";
import { MyHost } from "types/spawn";
import { string } from "utils";
import { EditSpawnHostButton } from "./EditSpawnHostButton";
import { SpawnHostActionButton } from "./SpawnHostActionButton";

const { copyToClipboard } = string;

export const SpawnHostTableActions: React.VFC<{ host: MyHost }> = ({
  host,
}) => (
  <FlexContainer>
    <SpawnHostActionButton host={host} />
    <CopySSHCommandButton
      user={host.user}
      hostUrl={host.hostUrl}
      hostStatus={host.status}
    />
    <EditSpawnHostButton host={host} />
  </FlexContainer>
);

export const CopySSHCommandButton: React.VFC<{
  user: string;
  hostUrl: string;
  hostStatus: string;
}> = ({ user, hostUrl, hostStatus }) => {
  const sshCommand = `ssh ${user}@${hostUrl}`;
  const spawnAnalytics = useSpawnAnalytics();

  const canSSH = hostStatus !== HostStatus.Terminated && !!hostUrl;
  const [hasCopied, setHasCopied] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setHasCopied(false), 10 * SECOND);
    return () => clearTimeout(timeout);
  }, [hasCopied]);

  return (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
    <span
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      <StyledTooltip
        align="top"
        justify="middle"
        data-cy="copy-ssh-tooltip"
        trigger={
          // Wrapper is necessary because disabled elements cannot trigger mouse events.
          <div data-cy="copy-ssh-button-wrapper">
            <PaddedButton
              data-cy="copy-ssh-button"
              disabled={!canSSH}
              leftGlyph={<Icon glyph="Copy" />}
              onClick={(event: React.MouseEvent) => {
                event.stopPropagation();
                copyToClipboard(sshCommand);
                spawnAnalytics.sendEvent({ name: "Copy SSH Command" });
                setHasCopied(!hasCopied);
              }}
              size={Size.XSmall}
            >
              <Label>SSH Command</Label>
            </PaddedButton>
          </div>
        }
      >
        {hasCopied ? (
          <Center>Copied!</Center>
        ) : (
          <Center>
            {canSSH
              ? `Must be on VPN to connect to host`
              : `Host must be running in order to SSH`}
          </Center>
        )}
      </StyledTooltip>
    </span>
  );
};

// @ts-expect-error
// For leafygreen Tooltip, there is a bug where you have to set the width to prevent misalignment when
// the trigger element is near the right side of a page. Ticket: https://jira.mongodb.org/browse/PD-1542
const StyledTooltip = styled(Tooltip)`
  width: ${tooltipWidth};
`;

const FlexContainer = styled.div`
  display: flex;
  align-items: center;
  line-height: 1;
`;

const Label = styled.span`
  white-space: nowrap;
`;

const Center = styled.span`
  text-align: center;
`;
