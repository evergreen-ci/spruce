import { useState } from "react";
import styled from "@emotion/styled";
import { Size } from "@leafygreen-ui/button";
import Tooltip from "@leafygreen-ui/tooltip";
import { useSpawnAnalytics } from "analytics";
import { ConditionalWrapper } from "components/ConditionalWrapper";
import { PaddedButton, tooltipWidth } from "components/Spawn";
import { EditSpawnHostModal } from "pages/spawn/spawnHost/index";
import { HostStatus } from "types/host";
import { MyHost } from "types/spawn";

interface EditSpawnHostButtonProps {
  host: MyHost;
}
export const EditSpawnHostButton: React.VFC<EditSpawnHostButtonProps> = ({
  host,
}) => {
  const [openModal, setOpenModal] = useState(false);
  const spawnAnalytics = useSpawnAnalytics();
  const canEditSpawnHost =
    host.status === HostStatus.Stopped || host.status === HostStatus.Running;
  return (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
    <span
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      <ConditionalWrapper
        condition={!canEditSpawnHost}
        wrapper={(children) => (
          <StyledTooltip
            align="top"
            justify="middle"
            triggerEvent="hover"
            trigger={children}
          >
            {`Can only edit a spawn host when the status is ${HostStatus.Stopped} or ${HostStatus.Running}`}
          </StyledTooltip>
        )}
      >
        <span>
          <PaddedButton
            size={Size.XSmall}
            disabled={!canEditSpawnHost} // @ts-expect-error
            onClick={(e) => {
              e.stopPropagation();
              setOpenModal(true);
              spawnAnalytics.sendEvent({
                name: "Open the Edit Spawn Host Modal",
                hostId: host.id,
                status: host.status,
              });
            }}
          >
            Edit
          </PaddedButton>
        </span>
      </ConditionalWrapper>
      <EditSpawnHostModal
        onCancel={() => setOpenModal(false)}
        visible={openModal}
        host={host}
      />
    </span>
  );
};

// @ts-expect-error
// For leafygreen Tooltip, there is a bug where you have to set the width to prevent misalignment when
// the trigger element is near the right side of a page. Ticket: https://jira.mongodb.org/browse/PD-1542
const StyledTooltip = styled(Tooltip)`
  width: ${tooltipWidth};
`;
