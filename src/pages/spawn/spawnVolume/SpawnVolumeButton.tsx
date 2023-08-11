import { useState } from "react";
import styled from "@emotion/styled";
import { palette } from "@leafygreen-ui/palette";
import Tooltip from "@leafygreen-ui/tooltip";
import { Disclaimer } from "@leafygreen-ui/typography";
import { useSpawnAnalytics } from "analytics/spawn/useSpawnAnalytics";
import { PlusButton } from "components/Buttons";
import { size, zIndex } from "constants/tokens";
import { SpawnVolumeModal } from "./SpawnVolumeModal";

interface SpawnVolumeButtonProps {
  maxSpawnableLimit: number;
  volumeLimit: number;
}

export const SpawnVolumeButton: React.FC<SpawnVolumeButtonProps> = ({
  maxSpawnableLimit,
  volumeLimit,
}) => {
  const [openModal, setOpenModal] = useState(false);
  const spawnAnalytics = useSpawnAnalytics();

  const reachedMaxVolumeSize = maxSpawnableLimit === 0;

  return (
    <PaddedContainer>
      <Tooltip
        align="top"
        justify="middle"
        triggerEvent="hover"
        popoverZIndex={zIndex.tooltip}
        trigger={
          <PlusButton
            data-cy="spawn-volume-btn"
            disabled={reachedMaxVolumeSize}
            onClick={() => {
              setOpenModal(true);
              spawnAnalytics.sendEvent({
                name: "Opened the Spawn Volume Modal",
              });
            }}
          >
            Spawn a volume
          </PlusButton>
        }
        enabled={reachedMaxVolumeSize}
      >
        {`You have reached the max volume limit (${volumeLimit} GiB). Delete some volumes to spawn more.`}
      </Tooltip>
      <Info>Limit {volumeLimit} GiB per User</Info>
      {openModal && (
        <SpawnVolumeModal
          visible={openModal}
          onCancel={() => setOpenModal(false)}
          maxSpawnableLimit={maxSpawnableLimit}
        />
      )}
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
  color: ${palette.gray.dark2};
`;
