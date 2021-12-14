import styled from "@emotion/styled";
import { uiColors } from "@leafygreen-ui/palette";
import { ObjectFieldTemplateProps } from "@rjsf/core";

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
          <span data-cy="override-warning">
            This will override the variable of the same name defined in the
            repo.
          </span>
        )}
      </LeftColumn>
      <div>
        {variableValue.content}
        {isPrivate.content}
      </div>
    </RowContainer>
  );
};

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
