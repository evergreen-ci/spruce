import React from "react";
import styled from "@emotion/styled";
import Modal, { ModalSize } from "@leafygreen-ui/modal";
import { H3 } from "@leafygreen-ui/typography";

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
  <Modal data-cy={dataCy} open={open} setOpen={setOpen} size={size}>
    <ContentWrapper>
      {/* @ts-expect-error */}
      {title && <StyledHeader>{title}</StyledHeader>}
      {children}
    </ContentWrapper>
  </Modal>
);

// @ts-expect-error
const StyledHeader = styled(H3)`
  margin-bottom: 8px;
`;

const ContentWrapper = styled.div``;
