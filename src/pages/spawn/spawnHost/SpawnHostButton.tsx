import React, { useState } from "react";
import { PlusButton } from "components/Spawn";
import { SpawnHostModal } from "pages/spawn/spawnHost/index";

export const SpawnHostButton = () => {
  const [openModal, setOpenModal] = useState(false);
  return (
    <>
      <PlusButton onClick={() => setOpenModal(true)}>Spawn a host</PlusButton>
      <SpawnHostModal
        visible={openModal}
        onOk={() => {
          setOpenModal(false);
        }}
        onCancel={() => setOpenModal(false)}
      />
    </>
  );
};
