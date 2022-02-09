import React from "react";
import styled from "@emotion/styled";
import Button, { Variant } from "@leafygreen-ui/button";
import { Subtitle } from "@leafygreen-ui/typography";
import { Modal } from "antd";
import { size } from "constants/tokens";

interface PreferencesModalProps {
  title: string;
  action: string;
  onSubmit: () => void;
  onCancel: () => void;
  visible: boolean;
  disabled?: boolean;
}
export const PreferencesModal: React.FC<PreferencesModalProps> = ({
  title,
  action,
  onSubmit,
  visible,
  onCancel,
  disabled,
}) => (
  <Modal visible={visible} footer={null} onCancel={onCancel}>
    <Container>
      {/* @ts-expect-error */}
      <Title>{title}</Title>
      <ModalActionContainer>
        {/* @ts-expect-error */}
        <WideButton onClick={onCancel}>Cancel</WideButton>
        <WideButton
          variant={Variant.Danger} // @ts-expect-error
          onClick={onSubmit}
          disabled={disabled}
        >
          {action}
        </WideButton>
      </ModalActionContainer>
    </Container>
  </Modal>
);

// @ts-expect-error
const WideButton = styled(Button)`
  justify-content: center;
  width: 140px;
`;

// @ts-expect-error
const Title = styled(Subtitle)`
  margin-top: ${size.m};
  text-align: center;
`;
const ModalActionContainer = styled.div`
  margin-top: ${size.xl};
  display: flex;
  justify-content: space-between;
  width: 300px;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;
