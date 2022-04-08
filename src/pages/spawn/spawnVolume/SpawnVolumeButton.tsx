import React, { useState } from "react";
import { useQuery } from "@apollo/client";
import styled from "@emotion/styled";
import { uiColors } from "@leafygreen-ui/palette";
import { Disclaimer } from "@leafygreen-ui/typography";
import { useSpawnAnalytics } from "analytics/spawn/useSpawnAnalytics";
import { PlusButton } from "components/Spawn";
import { size } from "constants/tokens";
import { GetSpruceConfigQuery } from "gql/generated/types";
import { GET_SPRUCE_CONFIG } from "gql/queries";
import { SpawnVolumeModal } from "./spawnVolumeButton/SpawnVolumeModal";

export const SpawnVolumeButton: React.VFC = () => {
  const [openModal, setOpenModal] = useState(false);
  const spawnAnalytics = useSpawnAnalytics();
  const { data } = useQuery<GetSpruceConfigQuery>(GET_SPRUCE_CONFIG);
  const volumeLimit = data?.spruceConfig?.providers?.aws?.maxVolumeSizePerUser;
  return (
    <PaddedContainer>
      <PlusButton
        data-cy="spawn-volume-btn"
        onClick={() => {
          setOpenModal(true);
          spawnAnalytics.sendEvent({ name: "Opened the Spawn Volume Modal" });
        }}
      >
        Spawn a Volume
      </PlusButton>
      <Info>Limit {volumeLimit} GiB per User</Info>
      <SpawnVolumeModal
        visible={openModal}
        onCancel={() => setOpenModal(false)}
      />
    </PaddedContainer>
  );
};

const PaddedContainer = styled.div`
  padding: ${size.l} 0;
  display: flex;
  align-items: center;
`;

const Info = styled(Disclaimer)`
  font-weight: 300;
  padding-left: ${size.xs};
  position: relative;
  font-style: italic;
  color: ${uiColors.gray.dark2};
`;
