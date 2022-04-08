import React, { useState } from "react";
import Button, { Size } from "@leafygreen-ui/button";
import { MyVolume } from "types/spawn";
import { EditVolumeModal } from "./editButton/EditVolumeModal";

interface Props {
  volume: MyVolume;
}

export const EditButton: React.VFC<Props> = ({ volume }) => {
  const [openModal, setOpenModal] = useState(false);

  return (
    <>
      <Button
        size={Size.XSmall}
        data-cy={`edit-btn-${volume.displayName || volume.id}`}
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
