import { useState } from "react";
import Button from "@leafygreen-ui/button";
import ConfirmationModal, { Variant } from "@leafygreen-ui/confirmation-modal";

interface ConfirmPatchButtonProps {
  disabled: boolean;
  onConfirm: () => void;
  commitTitle: string;
}
export const ConfirmPatchButton: React.VFC<ConfirmPatchButtonProps> = ({
  disabled,
  onConfirm,
  commitTitle,
}) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        data-cy="commit-queue-patch-button"
        disabled={disabled}
        onClick={() => setOpen(!open)}
      >
        Remove Patch From Queue
      </Button>
      <ConfirmationModal
        data-cy="commit-queue-confirmation-modal"
        open={open}
        onConfirm={() => {
          onConfirm();
          setOpen(false);
        }}
        title="Are you sure you want to remove this patch from the commit queue?"
        buttonText="Remove"
        variant={Variant.Danger}
      >
        {commitTitle}
      </ConfirmationModal>
    </>
  );
};
