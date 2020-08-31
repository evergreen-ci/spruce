import React from "react";
import styled from "@emotion/styled";
import { uiColors } from "@leafygreen-ui/palette";
import { H2 } from "@leafygreen-ui/typography";
import { Modal as AntdModal } from "antd";
import { hexToRGBA } from "utils/color";

interface ModalProps {
  footer: JSX.Element[] | JSX.Element;
  title: string;
  "data-cy": string;
  visible: boolean;
  onCancel: (e?: React.MouseEvent<HTMLElement, MouseEvent>) => void;
}

export const Modal: React.FC<ModalProps> = ({
  footer,
  title,
  onCancel,
  visible,
  children,
  "data-cy": dataCy,
}) => (
  <StyledModal
    maskStyle={{
      backgroundColor,
    }}
    centered
    footer={null}
    visible={visible}
    onCancel={onCancel}
    width="50%"
    wrapProps={{
      "data-cy": dataCy,
    }}
  >
    <ModalTitle data-cy="modal-title">{title}</ModalTitle>
    {children}
    {footer && <Footer>{footer}</Footer>}
  </StyledModal>
);

const backgroundColor = hexToRGBA(uiColors.black, 0.9);

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
