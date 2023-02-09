import { useRef, useState } from "react";
import Button, { Size } from "@leafygreen-ui/button";
import FirstTimeGuideCue from "components/FirstTimeGuideCue";
import { SEEN_MIGRATE_GUIDE_CUE } from "constants/cookies";
import { TableVolume } from "types/spawn";
import { MigrateVolumeModal } from "./migrateButton/MigrateVolumeModal";

interface Props {
  volume: TableVolume;
}

export const MigrateButton: React.VFC<Props> = ({ volume }) => {
  const [openModal, setOpenModal] = useState(false);
  const triggerRef = useRef(null);
  const [openGuideCue, setOpenGuideCue] = useState(volume.showMigrateBtnCue);
  const onHideCue = () => {
    setOpenGuideCue(false);
  };
  return (
    <>
      <FirstTimeGuideCue
        data-cy="migrate-cue"
        defaultOpen={openGuideCue}
        cookieName={SEEN_MIGRATE_GUIDE_CUE}
        title="New feature!"
        refEl={triggerRef}
        numberOfSteps={1}
        currentStep={1}
        description="You can now migrate your home volume to a new spawn host!"
      />
      <Button
        ref={triggerRef}
        size={Size.XSmall}
        data-cy={`migrate-btn-${volume.displayName || volume.id}`}
        disabled={volume.migrating}
        onClick={(e) => {
          e.stopPropagation();
          onHideCue();
          setOpenModal(true);
        }}
      >
        Migrate
      </Button>
      {openModal && (
        <MigrateVolumeModal
          open={openModal}
          setOpen={setOpenModal}
          volume={volume}
        />
      )}
    </>
  );
};
