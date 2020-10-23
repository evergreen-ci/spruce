import React, { useState } from "react";
import styled from "@emotion/styled";
import { useLocation } from "react-router";
import { useSpawnAnalytics } from "analytics";
import { PlusButton } from "components/Spawn";
import { SpawnHostModal } from "pages/spawn/spawnHost/index";
import { parseQueryString } from "utils";

export const SpawnHostButton = () => {
  const { search } = useLocation();
  const queryParams = parseQueryString(search);
  const shouldSpawnHost = queryParams.spawnHost === "True";
  const [openModal, setOpenModal] = useState(shouldSpawnHost);
  const spawnAnalytics = useSpawnAnalytics();
  return (
    <PaddedContainer>
      <PlusButton
        onClick={() => {
          setOpenModal(true);
          spawnAnalytics.sendEvent({ name: "Opened the Spawn Host Modal" });
        }}
        data-cy="spawn-host-button"
      >
        Spawn a host
      </PlusButton>
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
