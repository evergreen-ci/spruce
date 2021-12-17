import styled from "@emotion/styled";
import { uiColors } from "@leafygreen-ui/palette";
import { ObjectFieldTemplateProps } from "@rjsf/core";
import Icon from "components/Icon";

const { yellow } = uiColors;

export const VariableRow: React.FC<
  Pick<ObjectFieldTemplateProps, "formData" | "properties" | "uiSchema">
> = ({ formData, properties, uiSchema }) => {
  const [variableName, variableValue, isPrivate] = properties;
  const repoData = uiSchema?.options?.repoData;
  const inRepo = repoData
    ? repoData.vars.some(({ varName }) => varName === formData.varName)
    : false;

  return (
    <RowContainer>
      <LeftColumn showWarning={inRepo}>
        {variableName.content}
        {inRepo && (
          <OverrideWarning data-cy="override-warning">
            <Icon glyph="ImportantWithCircle" size="small" />
            This will override the variable of the same name defined in the
            repo.
          </OverrideWarning>
        )}
      </LeftColumn>
      <div>
        {variableValue.content}
        {isPrivate.content}
      </div>
    </RowContainer>
  );
};

const OverrideWarning = styled.span`
  svg {
    margin-right: 4px;
    margin-top: 1px;
    vertical-align: text-top;
  }
`;

const LeftColumn = styled.div`
  color: ${yellow.dark2};
  padding-right: 16px;

  ${(props: { showWarning?: boolean }): string =>
    props.showWarning &&
    `input {
    border-color: ${yellow.dark2};
  }`}
`;

const RowContainer = styled.div`
  display: flex;
  margin-bottom: 16px;

  > div {
    flex-grow: 1;
    max-width: 50%;
  }

  > div > div > div {
    margin-bottom: 4px;
  }
`;
