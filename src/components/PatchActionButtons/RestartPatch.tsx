import React, { useState, forwardRef } from "react";
import { Disclaimer } from "@leafygreen-ui/typography";
import { Button } from "components/Button";
import { DropdownItem } from "components/ButtonDropdown";
import { PatchRestartModal } from "pages/patch/index";

interface RestartPatchProps {
  patchId: string;
  disabled: boolean;
  isButton?: boolean;
  refetchQueries: string[];
  hideMenu: (e?: React.MouseEvent<HTMLElement, MouseEvent>) => void;
}
export const RestartPatch = forwardRef<HTMLDivElement, RestartPatchProps>(
  ({ isButton, disabled, patchId, refetchQueries, hideMenu }, ref) => {
    const [openModal, setOpenModal] = useState(false);
    return (
      <>
        {isButton ? (
          <Button
            size="small"
            dataCy="restart-patch"
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
          <div className={openModal ? "ant-popover-open" : ""} ref={ref}>
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
          </div>
        )}
      </>
    );
  }
);
