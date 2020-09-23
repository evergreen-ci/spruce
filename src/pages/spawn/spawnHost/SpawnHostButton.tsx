import React, { useState } from "react";
import styled from "@emotion/styled";
import { PlusButton } from "components/Spawn";
import { SpawnHostModal } from "pages/spawn/spawnHost/index";

export const SpawnHostButton = () => {
  const [openModal, setOpenModal] = useState(false);
  return (
    <PaddedContainer>
      <PlusButton onClick={() => setOpenModal(true)}>Spawn a host</PlusButton>
      <SpawnHostModal
        visible={openModal}
        onCancel={() => setOpenModal(false)}
      />
    </PaddedContainer>
  );
};

const PaddedContainer = styled.div`
  padding-top: 30px;
  padding-bottom: 30px;
`;
