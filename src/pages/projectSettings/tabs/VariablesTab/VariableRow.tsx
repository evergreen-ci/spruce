import styled from "@emotion/styled";
import { palette } from "@leafygreen-ui/palette";
import { ObjectFieldTemplateProps } from "@rjsf/core";
import Icon from "components/Icon";
import { getFields } from "components/SpruceForm/utils";
import { size } from "constants/tokens";

const { yellow } = palette;

export const VariableRow: React.FC<
  Pick<ObjectFieldTemplateProps, "formData" | "properties" | "uiSchema">
> = ({ formData, properties, uiSchema }) => {
  const [variableName, variableValue, isPrivate, isAdminOnly] = getFields(
    properties,
    formData.isDisabled,
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
        <OptionRow>
          {isPrivate}
          {isAdminOnly}
        </OptionRow>
      </div>
    </RowContainer>
  );
};

const OverrideIcon = styled(Icon)`
  margin-right: ${size.xxs};
  margin-top: 1px;
  vertical-align: text-top;
`;

const LeftColumn = styled.div`
  color: ${yellow.dark2};
  padding-right: ${size.s};

  ${(props: { showWarning?: boolean }): string =>
    props.showWarning &&
    `input {
    border-color: ${yellow.dark2};
  }`}
`;

const RowContainer = styled.div`
  display: flex;
  margin-bottom: ${size.s};

  > div {
    flex-grow: 1;
    max-width: 50%;
  }
`;

const OptionRow = styled.div`
  display: flex;
  margin-bottom: ${size.s};

  > div {
    flex-shrink: 0;
    margin-right: ${size.s};
    width: fit-content;
  }
`;
