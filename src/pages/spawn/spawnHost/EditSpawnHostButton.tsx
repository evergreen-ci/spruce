import { useState } from "react";
import Button, { Size } from "@leafygreen-ui/button";
import Tooltip from "@leafygreen-ui/tooltip";
import { useSpawnAnalytics } from "analytics";
import { ConditionalWrapper } from "components/ConditionalWrapper";
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
        <div>
          <Button
            size={Size.XSmall}
            disabled={!canEditSpawnHost}
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
          </Button>
        </div>
      </ConditionalWrapper>
      <EditSpawnHostModal
        onCancel={() => setOpenModal(false)}
        visible={openModal}
        host={host}
      />
    </span>
  );
};
