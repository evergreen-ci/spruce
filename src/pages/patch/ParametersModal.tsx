import React, { useState } from "react";
import styled from "@emotion/styled";
import Badge from "@leafygreen-ui/badge";
import { Modal } from "components/Modal";
import { StyledLink } from "components/styles";
import { P2 } from "components/Typography";
import { Parameter } from "gql/generated/types";

interface ParametersProps {
  parameters: Parameter[];
  dataCy: string;
}

export const ParametersModal: React.FC<ParametersProps> = ({
  parameters,
  dataCy,
}) => {
  const [showModal, setShowModal] = useState<boolean>(false);
  return (
    <>
      {parameters !== undefined && parameters.length > 0 && (
        <P2>
          <StyledLink
            data-cy="parameters-link"
            onClick={() => setShowModal(true)}
          >
            Patch Parameters
          </StyledLink>
        </P2>
      )}

      <Modal
        visible={showModal}
        footer={null}
        onCancel={() => setShowModal(false)}
        data-cy={dataCy}
        title="Patch Parameters"
      >
        {parameters?.map((param) => (
          <StyledBadge key={`param_${param.key}`}>
            {param.key}:{param.value}
          </StyledBadge>
        ))}
      </Modal>
    </>
  );
};

const StyledBadge = styled(Badge)`
  margin-left: 16px;
`;
