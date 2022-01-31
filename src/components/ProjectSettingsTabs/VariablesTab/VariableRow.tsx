import styled from "@emotion/styled";
import { uiColors } from "@leafygreen-ui/palette";
import { ObjectFieldTemplateProps } from "@rjsf/core";
import Icon from "components/Icon";
import { size } from "constants/tokens";

import { getFields } from "../utils";

const { yellow } = uiColors;

export const VariableRow: React.FC<
  Pick<ObjectFieldTemplateProps, "formData" | "properties" | "uiSchema">
> = ({ formData, properties, uiSchema }) => {
  const [variableName, variableValue, isPrivate] = getFields(
    properties,
    formData.isDisabled
  );
  const repoData = uiSchema?.options?.repoData;
  const inRepo = repoData
    ? repoData.vars.some(({ varName }) => varName === formData.varName)
    : false;

  return (
    <RowContainer>
      <LeftColumn showWarning={inRepo}>
        {variableName}
        {inRepo && (
          <span data-cy="override-warning">
            <OverrideIcon glyph="ImportantWithCircle" size="small" />
            This will override the variable of the same name defined in the
            repo.
          </span>
        )}
      </LeftColumn>
      <div>
        {variableValue}
        {isPrivate}
      </div>
    </RowContainer>
  );
};

const OverrideIcon = styled(Icon)`
  margin-right: ${size.xxs}px;
  margin-top: 1px;
  vertical-align: text-top;
`;

const LeftColumn = styled.div`
  color: ${yellow.dark2};
  padding-right: ${size.s}px;

  ${(props: { showWarning?: boolean }): string =>
    props.showWarning &&
    `input {
    border-color: ${yellow.dark2};
  }`}
`;

const RowContainer = styled.div`
  display: flex;
  margin-bottom: ${size.s}px;

  > div {
    flex-grow: 1;
    max-width: 50%;
  }
`;
