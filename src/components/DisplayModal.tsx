import styled from "@emotion/styled";
import Modal, { ModalSize } from "@leafygreen-ui/modal";
import { H3 } from "@leafygreen-ui/typography";
import { size as tokenSize, zIndex } from "constants/tokens";

export interface DisplayModalProps {
  "data-cy"?: string;
  open?: boolean;
  setOpen?: (
    open: boolean
  ) => void | React.Dispatch<React.SetStateAction<boolean>>;
  size?: ModalSize;
  title?: string;
  children: React.ReactNode;
}

export const DisplayModal: React.VFC<DisplayModalProps> = ({
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
  z-index: ${zIndex.modal};
`;

// @ts-expect-error
const StyledHeader = styled(H3)`
  margin-bottom: ${tokenSize.xs};
`;
