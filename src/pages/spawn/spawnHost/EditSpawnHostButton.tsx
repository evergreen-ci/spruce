import React, { useState } from "react";
import { Size } from "@leafygreen-ui/button";
import Tooltip from "@leafygreen-ui/tooltip";
import { useSpawnAnalytics } from "analytics";
import { ConditionalWrapper } from "components/ConditionalWrapper";
import { PaddedButton } from "components/Spawn";
import { EditSpawnHostModal } from "pages/spawn/spawnHost/index";
import { HostStatus } from "types/host";
import { MyHost } from "types/spawn";

interface EditSpawnHostButtonProps {
  host: MyHost;
}
export const EditSpawnHostButton: React.FC<EditSpawnHostButtonProps> = ({
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
          <Tooltip
            align="top"
            justify="middle"
            triggerEvent="hover"
            trigger={children}
          >
            {`Can only edit a spawn host when the status is ${HostStatus.Stopped} or ${HostStatus.Running}`}
          </Tooltip>
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
