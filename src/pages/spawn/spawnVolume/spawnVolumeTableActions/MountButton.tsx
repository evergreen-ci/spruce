import { useState } from "react";
import Button, { Size } from "@leafygreen-ui/button";
import { TableVolume } from "types/spawn";
import { MountVolumeModal } from "./MountVolumeModal";

interface Props {
  volume: TableVolume;
}

export const MountButton: React.FC<Props> = ({ volume }) => {
  const [openModal, setOpenModal] = useState(false);

  return (
    <>
      <Button
        size={Size.XSmall}
        data-cy={`attach-btn-${volume.displayName || volume.id}`}
        disabled={volume.migrating}
        onClick={(e) => {
          e.stopPropagation();
          setOpenModal(true);
        }}
      >
        Mount
      </Button>
      <MountVolumeModal
        visible={openModal}
        onCancel={() => setOpenModal(false)}
        volume={volume}
      />
    </>
  );
};
