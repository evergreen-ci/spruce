import styled from "@emotion/styled";
import { ObjectFieldTemplateProps } from "@rjsf/core";
import { size } from "constants/tokens";
import { form } from "pages/projectSettings/tabs/utils";

const { getFields } = form;

export const HTTPHeaderRow: React.VFC<
  Pick<ObjectFieldTemplateProps, "formData" | "properties" | "uiSchema">
> = ({ formData, properties }) => {
  const [keyInput, valueInput] = getFields(properties, formData.isDisabled);

  return (
    <RowContainer>
      <LeftColumn>{keyInput}</LeftColumn>
      <RightColumn>{valueInput}</RightColumn>
    </RowContainer>
  );
};

const LeftColumn = styled.div`
  padding-right: ${size.s};
  min-width: 200px;
`;

const RightColumn = styled.div`
  min-width: 200px;
`;

const RowContainer = styled.div`
  display: flex;
  align-items: flex-start;
  margin-bottom: ${size.s};
`;
