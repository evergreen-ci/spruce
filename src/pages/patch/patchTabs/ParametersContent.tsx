import React from "react";
import styled from "@emotion/styled";
import Badge from "@leafygreen-ui/badge";
import { Disclaimer } from "@leafygreen-ui/typography";
import { EditableTagField } from "components/EditableTagField";
import { ParameterInput, SchedulePatchMutation } from "gql/generated/types";

interface Props {
  patchActivated: boolean;
  patchParameters: SchedulePatchMutation["schedulePatch"]["parameters"];
  setPatchParams: (p: ParameterInput[]) => void;
}

export const ParametersContent: React.FC<Props> = ({
  patchActivated,
  patchParameters,
  setPatchParams,
}) => (
  <ParamsContainer>
    {patchActivated ? (
      <>
        <Disclaimer>
          <span data-cy="parameters-disclaimer">
            Parameters cannot be added or modified once a patch is configured
          </span>
        </Disclaimer>
        {patchParameters && (
          <ExistingParamsContainer>
            {" "}
            {patchParameters?.map((param) => (
              <StyledBadge
                data-cy={`badge-${param.key}`}
                key={`param_${param.key}`}
              >
                {param.key}:{param.value}
              </StyledBadge>
            ))}
          </ExistingParamsContainer>
        )}
      </>
    ) : (
      <EditableTagField
        inputTags={patchParameters}
        onChange={setPatchParams}
        buttonText="Add Parameter"
      />
    )}
  </ParamsContainer>
);

const StyledBadge = styled(Badge)`
  margin-right: 16px;
  margin-top: 15px;
  margin-bottom: 15px;
`;
export const ParamsContainer = styled.div`
  margin-left: 20px;
  width: 70%;
`;

export const ExistingParamsContainer = styled.div`
  width: 70%;
`;
