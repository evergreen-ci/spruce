import { useState } from "react";
import Button, { Size } from "@leafygreen-ui/button";
import { TableVolume } from "types/spawn";
import { EditVolumeModal } from "./EditVolumeModal";

interface Props {
  volume: TableVolume;
}

export const EditButton: React.FC<Props> = ({ volume }) => {
  const [openModal, setOpenModal] = useState(false);

  return (
    <>
      <Button
        size={Size.XSmall}
        data-cy={`edit-btn-${volume.displayName || volume.id}`}
        disabled={volume.migrating}
        onClick={(e) => {
          e.stopPropagation();
          setOpenModal(true);
        }}
      >
        Edit
      </Button>
      {openModal && (
        <EditVolumeModal
          visible={openModal}
          onCancel={() => setOpenModal(false)}
          volume={volume}
        />
      )}
    </>
  );
};
