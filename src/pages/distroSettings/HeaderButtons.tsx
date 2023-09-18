import { useState } from "react";
import Button from "@leafygreen-ui/button";
import { DistroQuery } from "gql/generated/types";
import { useDistroSettingsContext } from "./Context";
import { SaveModal } from "./SaveModal";
import { WritableDistroSettingsType } from "./tabs/types";

interface Props {
  distro: DistroQuery["distro"];
  tab: WritableDistroSettingsType;
}

export const HeaderButtons: React.FC<Props> = ({ distro, tab }) => {
  const { getTab } = useDistroSettingsContext();
  const { hasChanges, hasError } = getTab(tab);

  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <Button
        data-cy="save-settings-button"
        disabled={hasError || !hasChanges}
        onClick={() => setModalOpen(true)}
        variant="primary"
      >
        Save changes on page
      </Button>
      <SaveModal
        distro={distro}
        open={modalOpen}
        onConfirm={() => setModalOpen(false)}
        onCancel={() => setModalOpen(false)}
        tab={tab}
      />
    </>
  );
};
