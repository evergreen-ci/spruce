import styled from "@emotion/styled";
import { ObjectFieldTemplateProps } from "@rjsf/core";
import { size } from "constants/tokens";
import { form } from "pages/projectSettings/tabs/utils";

const { getFields } = form;

export const RegexSelectorRow: React.VFC<
  Pick<ObjectFieldTemplateProps, "formData" | "properties" | "uiSchema">
> = ({ formData, properties }) => {
  const [regexSelect, regexInput] = getFields(properties, formData.isDisabled);

  return (
    <RowContainer data-cy="regex-selector-row">
      <LeftColumn>{regexSelect}</LeftColumn>
      <MiddleText> matches </MiddleText>
      <RightColumn>{regexInput}</RightColumn>
    </RowContainer>
  );
};

const columnSize = "200px";

const LeftColumn = styled.div`
  min-width: ${columnSize};
  padding-right: ${size.s};
`;

const MiddleText = styled.div`
  padding-right: ${size.s};
  margin-top: ${size.l};
  white-space: nowrap;
`;

const RightColumn = styled.div`
  min-width: ${columnSize};
`;

const RowContainer = styled.div`
  display: flex;
  align-items: flex-start;
  margin-bottom: ${size.s};
`;
