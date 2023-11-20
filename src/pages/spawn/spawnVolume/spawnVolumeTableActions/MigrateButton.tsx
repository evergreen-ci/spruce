import { useRef, useState } from "react";
import Button, { Size } from "@leafygreen-ui/button";
import { TableVolume } from "types/spawn";
import { MigrateVolumeModal } from "./MigrateVolumeModal";

interface Props {
  volume: TableVolume;
}

export const MigrateButton: React.FC<Props> = ({ volume }) => {
  const [openModal, setOpenModal] = useState(false);
  const triggerRef = useRef(null);
  return (
    <>
      <Button
        ref={triggerRef}
        size={Size.XSmall}
        data-cy={`migrate-btn-${volume.displayName || volume.id}`}
        disabled={volume.migrating}
        onClick={(e) => {
          e.stopPropagation();
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
