import { useState } from "react";
import Button, { Size } from "@leafygreen-ui/button";
import { SpawnHostModal } from "pages/spawn/spawnHost/SpawnHostModal";
import { MyVolume } from "types/spawn";

interface Props {
  volume: MyVolume;
}

export const MigrateBtn: React.VFC<Props> = ({ volume }) => {
  const [openModal, setOpenModal] = useState(false);

  return (
    <>
      <Button
        size={Size.XSmall}
        data-cy={`migrate-btn-${volume.displayName || volume.id}`}
        onClick={(e) => {
          e.stopPropagation();
          setOpenModal(true);
        }}
      >
        Migrate
      </Button>
      <SpawnHostModal
        open={openModal}
        setOpen={setOpenModal}
        migrateVolumeId={volume.id}
      />
    </>
  );
};
