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
    <RowContainer>
      <LeftColumn>{regexSelect}</LeftColumn>
      <MiddleText> matches regex </MiddleText>
      <RightColumn>{regexInput}</RightColumn>
    </RowContainer>
  );
};

const LeftColumn = styled.div`
  padding-right: ${size.s};
  min-width: 200px;
`;

const MiddleText = styled.div`
  padding-right: ${size.s};
  margin-top: ${size.m};
  white-space: nowrap;
`;

const RightColumn = styled.div`
  min-width: 200px;
`;

const RowContainer = styled.div`
  display: flex;
  align-items: flex-start;
  margin-bottom: ${size.s};
`;
