import React, { useState } from "react";
import Button from "@leafygreen-ui/button";
import { MyVolumesQuery } from "gql/generated/types";
import { MountVolumeModal } from "./mountButton/MountVolumeModal";

type Volume = MyVolumesQuery["myVolumes"][0];
interface Props {
  volume: Volume;
}

export const MountBtn: React.FC<Props> = ({ volume }) => {
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
