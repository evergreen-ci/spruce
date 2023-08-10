import styled from "@emotion/styled";
import Badge from "@leafygreen-ui/badge";
import { Body } from "@leafygreen-ui/typography";
import { EditableTagField } from "components/EditableTagField";
import { size } from "constants/tokens";
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
        <Body data-cy="parameters-disclaimer">
          Parameters cannot be added or modified once a patch is configured.
        </Body>
        {patchParameters && (
          <ExistingParamsContainer>
            {patchParameters?.map((param) => (
              <StyledBadge
                data-cy={`badge-${param.key}`}
                key={`param_${param.key}`}
              >
                {param.key}: {param.value}
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
  margin-right: ${size.s};
  margin-top: ${size.s};
  margin-bottom: ${size.s};
`;
export const ParamsContainer = styled.div`
  margin-left: ${size.m};
  width: 70%;
`;

export const ExistingParamsContainer = styled.div`
  width: 70%;
`;
