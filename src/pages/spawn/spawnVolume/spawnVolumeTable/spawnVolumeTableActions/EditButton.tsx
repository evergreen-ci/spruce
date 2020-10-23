import React, { useState } from "react";
import Button from "@leafygreen-ui/button";
import { MyVolume } from "types/spawn";
import { EditVolumeModal } from "./editButton/EditVolumeModal";

interface Props {
  volume: MyVolume;
}

export const EditButton: React.FC<Props> = ({ volume }) => {
  const [openModal, setOpenModal] = useState(false);

  return (
    <>
      <Button
        size="small"
        data-cy={`attach-btn-${volume.displayName || volume.id}`}
        onClick={(e) => {
          e.stopPropagation();
          setOpenModal(true);
        }}
      >
        Edit
      </Button>
      <EditVolumeModal
        visible={openModal}
        onCancel={() => setOpenModal(false)}
        volume={volume}
      />
    </>
  );
};
