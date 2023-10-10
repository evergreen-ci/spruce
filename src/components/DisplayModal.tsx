import styled from "@emotion/styled";
import Modal, { ModalProps } from "@leafygreen-ui/modal";
import { Body, BodyProps, H3 } from "@leafygreen-ui/typography";
import { size as tokenSize, zIndex } from "constants/tokens";

type DisplayModalProps = Omit<ModalProps, "title"> & {
  title?: React.ReactNode | string;
  subtitle?: string;
};

export const DisplayModal: React.FC<DisplayModalProps> = ({
  children,
  subtitle,
  title,
  ...rest
}) => (
  <StyledModal {...rest}>
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
