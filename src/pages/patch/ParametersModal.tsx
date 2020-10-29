import React from "react";
import styled from "@emotion/styled";
import Badge from "@leafygreen-ui/badge";
import { Modal } from "antd";
import { Parameter } from "types/patch";

interface ParametersProps {
  parameters: Parameter[];
  dataCy: string;
  closeModal: () => void;
  visible: boolean;
}
export const ParametersModal: React.FC<ParametersProps> = ({
  parameters,
  dataCy,
  closeModal,
  visible,
}) => (
  <Modal
    visible={visible}
    footer={null}
    onCancel={closeModal}
    data-cy={dataCy}
    title="Patch Parameters"
  >
    <span>
      {parameters?.map(
        (param) =>
          param && (
            <StyledBadge key={`param_${param?.key}`}>
              {param?.key}:{param?.value}
            </StyledBadge>
          )
      )}
    </span>
  </Modal>
);

const StyledBadge = styled(Badge)`
  margin-left: 16px;
`;
