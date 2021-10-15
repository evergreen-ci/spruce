import { css } from "@emotion/react";
import Modal, { Variant } from "@leafygreen-ui/confirmation-modal";

interface ConfirmationModalProps {
  title: string;
  open?: boolean;
  onConfirm?: () => void;
  onCancel?: () => void;
  buttonText: string;
  variant?: Variant;
  requiredInputText?: string;
  submitDisabled?: boolean;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  buttonText,
  children,
  onCancel,
  onConfirm,
  open,
  requiredInputText,
  submitDisabled,
  variant,
}) => (
  <Modal
    buttonText={buttonText}
    onCancel={onCancel}
    onConfirm={onConfirm}
    open={open}
    requiredInputText={requiredInputText}
    submitDisabled={submitDisabled}
    title="Move Repo"
    variant={variant}
    css={css`
      z-index: 1;
    `}
  >
    {children}
  </Modal>
);
