import React, { useState } from "react";
import { PlusButton } from "components/Spawn";

export const SpawnVolumeButton = () => {
  const [openModal, setOpenModal] = useState(false);
  return (
    <>
      <PlusButton onClick={() => setOpenModal(true)}>Create Volume</PlusButton>
    </>
  );
};
