import React from "react";
import styled from "@emotion/styled";
import Button, { Variant } from "@leafygreen-ui/button";
import { Subtitle } from "@leafygreen-ui/typography";
import { Modal } from "antd";

interface PreferencesModalProps {
  title: string;
  action: string;
  onSubmit: (e: any) => void;
  onCancel: () => void;
  visible: boolean;
}
export const PreferencesModal: React.FC<PreferencesModalProps> = ({
  title,
  action,
  onSubmit,
  visible,
  onCancel,
}) => (
  <Modal visible={visible} footer={null} onCancel={onCancel}>
    <Container>
      <Title>{title}</Title>
      <ModalActionContainer>
        <WideButton onClick={onCancel}>Cancel</WideButton>
        <WideButton variant={Variant.Danger} onClick={onSubmit}>
          {action}
        </WideButton>
      </ModalActionContainer>
    </Container>
  </Modal>
);

const WideButton = styled(Button)`
  justify-content: center;
  width: 140px;
`;
const Title = styled(Subtitle)`
  margin-top: 25px;
  text-align: center;
`;
const ModalActionContainer = styled.div`
  margin-top: 65px;
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
