import styled from "@emotion/styled";
import Modal, { Variant } from "@leafygreen-ui/confirmation-modal";

interface ConfirmationModalProps {
  "data-cy"?: string;
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
  "data-cy": dataCy,
  onCancel,
  onConfirm,
  open,
  requiredInputText,
  submitDisabled,
  variant,
}) => (
  <StyledModal
    buttonText={buttonText}
    data-cy={dataCy}
    onCancel={onCancel}
    onConfirm={onConfirm}
    open={open}
    requiredInputText={requiredInputText}
    submitDisabled={submitDisabled}
    title="Move Repo"
    variant={variant}
  >
    {children}
  </StyledModal>
);

const StyledModal = styled(Modal)`
  z-index: 1;
`;
