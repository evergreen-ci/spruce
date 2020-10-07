import React from "react";
import styled from "@emotion/styled";
import { uiColors } from "@leafygreen-ui/palette";
import { H2 } from "@leafygreen-ui/typography";
import { Modal as AntdModal } from "antd";
import { hexToRGBA } from "utils/color";

interface ModalProps {
  footer: JSX.Element[] | JSX.Element;
  title: string | JSX.Element;
  "data-cy": string;
  visible: boolean;
  onCancel: (e?: React.MouseEvent<HTMLElement, MouseEvent>) => void;
  onOk?: () => void;
}

export const Modal: React.FC<ModalProps> = ({
  footer,
  title,
  onCancel,
  visible,
  children,
  onOk,
  "data-cy": dataCy,
}) => (
  // eslint-disable-next-line
  <div onClick={(e) => e.stopPropagation()}>
    <StyledModal
      maskStyle={{
        backgroundColor,
      }}
      onOk={onOk}
      centered
      footer={footer}
      visible={visible}
      onCancel={onCancel}
      width="50%"
      wrapProps={{
        "data-cy": dataCy,
      }}
    >
      <ModalTitle data-cy="modal-title">{title}</ModalTitle>
      {children}
    </StyledModal>
  </div>
);

const backgroundColor = hexToRGBA(uiColors.black, 0.9);

const ModalTitle = styled(H2)`
  padding-bottom: 16px;
  margin-bottom: 16px;
  border-bottom: 1px solid ${uiColors.gray.light2};
`;

const StyledModal = styled(AntdModal)`
  .ant-modal-body {
    padding-bottom: 89px;
  }
`;
