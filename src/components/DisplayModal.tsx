import styled from "@emotion/styled";
import Modal, { ModalSize } from "@leafygreen-ui/modal";
import { Body, BodyProps, H3 } from "@leafygreen-ui/typography";
import { size as tokenSize, zIndex } from "constants/tokens";

export interface DisplayModalProps {
  "data-cy"?: string;
  open?: boolean;
  setOpen?: (
    open: boolean
  ) => void | React.Dispatch<React.SetStateAction<boolean>>;
  size?: ModalSize;
  title?: React.ReactNode | string;
  children: React.ReactNode;
  subtitle?: string;
}

export const DisplayModal: React.VFC<DisplayModalProps> = ({
  children,
  "data-cy": dataCy,
  open,
  setOpen,
  size,
  subtitle,
  title,
}) => (
  <StyledModal data-cy={dataCy} open={open} setOpen={setOpen} size={size}>
    {title && <H3 data-cy="modal-title">{title}</H3>}
    {subtitle && (
      <StyledSubtitle data-cy="modal-subtitle">{subtitle}</StyledSubtitle>
    )}
    {children}
  </StyledModal>
);

const StyledModal = styled(Modal)`
  /* Ensure modal appears above feedback dialog */
  z-index: ${zIndex.modal};
`;

const StyledSubtitle = styled(Body)<BodyProps>`
  margin-bottom: ${tokenSize.xs};
`;
