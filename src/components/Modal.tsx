import React from "react";
import { Modal as AntdModal } from "antd";
import { H2 } from "@leafygreen-ui/typography";
import styled from "@emotion/styled";
import { uiColors } from "@leafygreen-ui/palette";
export interface ModalProps {
  footer: JSX.Element;
  title: string;
  "data-test-id": string;
  visible: boolean;
  onCancel: (e?: React.MouseEvent<HTMLElement, MouseEvent>) => void;
}

export const Modal: React.FC<ModalProps> = ({
  footer,
  title,
  onCancel,
  visible,
  children,
  "data-test-id": dataTestId,
}) => (
  <StyledModal
    maskStyle={{
      backgroundColor: "hsla(0, 100%, 0%, .9)",
    }}
    centered
    data-test-id={dataTestId}
    footer={null}
    visible={visible}
    onCancel={onCancel}
    width="50%"
  >
    <ModalTitle>{title}</ModalTitle>
    {children}
    {footer && <Footer>{footer}</Footer>}
  </StyledModal>
);

const ModalTitle = styled(H2)`
  padding-bottom: 16px;
  margin-bottom: 16px;
  border-bottom: 1px solid ${uiColors.gray.light2};
`;

const Footer = styled.div`
  padding-top: 24px;
  float: right;
`;

const StyledModal = styled(AntdModal)`
  .ant-modal-body {
    padding-bottom: 89px;
  }
`;
