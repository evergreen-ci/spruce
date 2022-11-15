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
      <MiddleText> matches regex </MiddleText>
      <RightColumn>{regexInput}</RightColumn>
    </RowContainer>
  );
};

const columnSize = "180px";

const LeftColumn = styled.div`
  min-width: ${columnSize};
`;

const MiddleText = styled.div`
  margin-top: ${size.m};
  white-space: nowrap;
`;

const RightColumn = styled.div`
  min-width: ${columnSize};
`;

const RowContainer = styled.div`
  display: flex;
  align-items: flex-start;
  gap: ${size.xs};
  margin-bottom: ${size.s};
`;
