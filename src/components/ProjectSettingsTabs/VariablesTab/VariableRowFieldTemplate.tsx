import styled from "@emotion/styled";
import { uiColors } from "@leafygreen-ui/palette";
import { ObjectFieldTemplateProps } from "@rjsf/core";

const { yellow } = uiColors;

export const VariableRowFieldTemplate: React.FC<ObjectFieldTemplateProps> = ({
  formData,
  properties,
  uiSchema,
}) => {
  const repoData = uiSchema?.options?.repoData;
  const [variableName, variableValue, isPrivate] = properties;
  if (!repoData) {
    return (
      <RowContainer>
        <LeftColumn>{variableName.content}</LeftColumn>
        <div>
          {variableValue.content}
          {isPrivate.content}
        </div>
      </RowContainer>
    );
  }

  const { vars } = repoData;
  const inRepo = vars.some(({ name }) => name === formData.name);

  return (
    <RowContainer>
      <LeftColumn>
        {variableName.content}
        {inRepo && (
          <span>
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
