import styled from "@emotion/styled";
import { uiColors } from "@leafygreen-ui/palette";
import { ObjectFieldTemplateProps } from "@rjsf/core";
import Icon from "components/Icon";
import { Unpacked } from "types/utils";

const { yellow } = uiColors;

// Modify a field such that its internal disabled prop is true.
const disableField = (
  property: Unpacked<ObjectFieldTemplateProps["properties"]>
): Unpacked<ObjectFieldTemplateProps["properties"]>["content"] => ({
  ...property.content,
  props: {
    ...property.content.props,
    disabled: true,
  },
});

// Return child fields to be rendered
// Conditionally disable based on whether it has been flagged as such (i.e. is a private variable that has already been saved).
const getFields = (
  properties: ObjectFieldTemplateProps["properties"],
  isDisabled: boolean
): Array<Unpacked<ObjectFieldTemplateProps["properties"]>["content"]> =>
  isDisabled
    ? properties.map(disableField)
    : properties.map(({ content }) => content);

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
          <OverrideWarning data-cy="override-warning">
            <Icon glyph="ImportantWithCircle" size="small" />
            This will override the variable of the same name defined in the
            repo.
          </OverrideWarning>
        )}
      </LeftColumn>
      <div>
        {variableValue}
        {isPrivate}
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
