import { useState } from "react";
import styled from "@emotion/styled";
import Badge from "@leafygreen-ui/badge";
import { DisplayModal } from "components/DisplayModal";
import { MetadataItem } from "components/MetadataCard";
import { StyledLink } from "components/styles";
import { size } from "constants/tokens";
import { Parameter } from "gql/generated/types";

interface ParametersProps {
  parameters: Parameter[];
}

export const ParametersModal: React.VFC<ParametersProps> = ({ parameters }) => {
  const [showModal, setShowModal] = useState<boolean>(false);
  return (
    <>
      {parameters !== undefined && parameters.length > 0 && (
        <MetadataItem>
          <StyledLink
            data-cy="parameters-link"
            onClick={() => setShowModal(true)}
          >
            Patch Parameters
          </StyledLink>
        </MetadataItem>
      )}
      <DisplayModal
        open={showModal}
        setOpen={setShowModal}
        title="Patch Parameters"
        data-cy="parameters-modal"
      >
        {parameters?.map((param) => (
          <StyledBadge key={`param_${param.key}`}>
            {param.key}: {param.value}
          </StyledBadge>
        ))}
      </DisplayModal>
    </>
  );
};

// @ts-expect-error
const StyledBadge = styled(Badge)`
  :not(:last-of-type) {
    margin-right: ${size.s};
  }
`;
