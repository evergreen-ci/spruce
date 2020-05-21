import React, { useState } from "react";
import { PatchRestartModal } from "pages/patch/index";
import { Button } from "components/Button";
import { Disclaimer } from "@leafygreen-ui/typography";
import { DropdownItem } from "components/ButtonDropdown";

interface RestartPatchProps {
  patchId: string;
  disabled: boolean;
  isButton?: boolean;
  refetchQueries?: string[];
  hideMenu: (e?: React.MouseEvent<HTMLElement, MouseEvent>) => void;
}
export const RestartPatch: React.FC<RestartPatchProps> = ({
  isButton,
  disabled,
  patchId,
  refetchQueries,
  hideMenu,
}) => {
  const [openModal, setOpenModal] = useState(false);
  return (
    <>
      {isButton ? (
        <Button
          size="small"
          dataCy="restart-patch"
          key="restart"
          disabled={disabled}
          loading={false}
          onClick={() => setOpenModal(!openModal)}
        >
          Restart
        </Button>
      ) : (
        <DropdownItem
          disabled={disabled}
          data-cy="restart-patch"
          onClick={() => setOpenModal(!openModal)}
        >
          <Disclaimer>Restart</Disclaimer>
        </DropdownItem>
      )}
      {openModal && (
        <PatchRestartModal
          patchId={patchId}
          visible={openModal}
          onOk={() => {
            setOpenModal(false);
            hideMenu();
          }}
          onCancel={() => setOpenModal(false)}
          refetchQueries={refetchQueries}
        />
      )}
    </>
  );
};
