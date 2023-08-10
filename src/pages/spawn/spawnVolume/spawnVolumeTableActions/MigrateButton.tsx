import { useRef, useState } from "react";
import Button, { Size } from "@leafygreen-ui/button";
import { GuideCue } from "@leafygreen-ui/guide-cue";
import Cookies from "js-cookie";
import { SEEN_MIGRATE_GUIDE_CUE } from "constants/cookies";
import { TableVolume } from "types/spawn";
import { MigrateVolumeModal } from "./MigrateVolumeModal";

interface Props {
  volume: TableVolume;
}

export const MigrateButton: React.FC<Props> = ({ volume }) => {
  const [openModal, setOpenModal] = useState(false);
  const [openGuideCue, setOpenGuideCue] = useState(volume.showMigrateBtnCue);
  const triggerRef = useRef(null);
  const onHideCue = () => {
    Cookies.set(SEEN_MIGRATE_GUIDE_CUE, "true");
    setOpenGuideCue(false);
  };
  return (
    <>
      <GuideCue
        data-cy="migrate-cue"
        open={openGuideCue}
        setOpen={setOpenGuideCue}
        title="New feature!"
        refEl={triggerRef}
        numberOfSteps={1}
        currentStep={1}
        onPrimaryButtonClick={onHideCue}
      >
        You can now migrate your home volume to a new spawn host!
      </GuideCue>
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
