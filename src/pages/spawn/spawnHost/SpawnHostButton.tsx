import React, { useState } from "react";
import styled from "@emotion/styled";
import Button from "@leafygreen-ui/button";
import Icon from "@leafygreen-ui/icon";
import { SpawnHostModal } from "pages/spawn/spawnHost/index";

export const SpawnHostButton = () => {
  const [openModal, setOpenModal] = useState(false);
  return (
    <>
      <StyledButton
        glyph={<Icon glyph="Plus" />}
        onClick={() => setOpenModal(true)}
      >
        Spawn a host
      </StyledButton>
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

const StyledButton = styled(Button)`
  margin-top: 30px;
  margin-bottom: 30px;
`;
