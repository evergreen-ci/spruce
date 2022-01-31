import React from "react";
import styled from "@emotion/styled";
import Modal, { ModalSize } from "@leafygreen-ui/modal";
import { H3 } from "@leafygreen-ui/typography";
import { size as tokenSize } from "constants/tokens";

interface DisplayModalProps {
  "data-cy"?: string;
  open?: boolean;
  setOpen?: (
    open: boolean
  ) => void | React.Dispatch<React.SetStateAction<boolean>>;
  size?: ModalSize;
  title?: string;
}

export const DisplayModal: React.FC<DisplayModalProps> = ({
  children,
  "data-cy": dataCy,
  open,
  setOpen,
  size,
  title,
}) => (
  <StyledModal data-cy={dataCy} open={open} setOpen={setOpen} size={size}>
    {/* @ts-expect-error */}
    {title && <StyledHeader>{title}</StyledHeader>}
    {children}
  </StyledModal>
);

// @ts-expect-error
const StyledModal = styled(Modal)`
  /* Ensure modal appears above feedback dialog */
  z-index: 40;
`;

// @ts-expect-error
const StyledHeader = styled(H3)`
  margin-bottom: ${tokenSize.xs}px;
`;
