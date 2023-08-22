import { useState } from "react";
import styled from "@emotion/styled";
import Button from "@leafygreen-ui/button";
import ConfirmationModal, { Variant } from "@leafygreen-ui/confirmation-modal";

interface ConfirmPatchButtonProps {
  disabled: boolean;
  onConfirm: () => void;
  commitTitle: string;
}
export const ConfirmPatchButton: React.FC<ConfirmPatchButtonProps> = ({
  commitTitle,
  disabled,
  onConfirm,
}) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <StyledButton
        data-cy="commit-queue-patch-button"
        disabled={disabled}
        onClick={() => setOpen(!open)}
      >
        Remove Patch From Queue
      </StyledButton>
      <ConfirmationModal
        data-cy="commit-queue-confirmation-modal"
        open={open}
        onConfirm={() => {
          onConfirm();
          setOpen(false);
        }}
        onCancel={() => setOpen(false)}
        title="Are you sure you want to remove this patch from the commit queue?"
        buttonText="Remove"
        variant={Variant.Danger}
      >
        {commitTitle}
      </ConfirmationModal>
    </>
  );
};

const StyledButton = styled(Button)`
  // Without this the button stretches and the text overflows
  font-size: 12px;
`;
