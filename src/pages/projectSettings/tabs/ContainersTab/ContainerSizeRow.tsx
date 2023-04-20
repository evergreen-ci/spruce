import styled from "@emotion/styled";
import { ObjectFieldTemplateProps } from "@rjsf/core";
import { size } from "constants/tokens";
import { form } from "../utils";

const { getFields } = form;

export const ContainerSizeRow: React.VFC<
  Pick<ObjectFieldTemplateProps, "formData" | "properties" | "uiSchema">
> = ({ formData, properties }) => {
  const [name, memoryMb, cpu] = getFields(properties, formData.isDisabled);

  return (
    <RowContainer>
      {name}
      {memoryMb}
      {cpu}
    </RowContainer>
  );
};

const RowContainer = styled.div`
  display: flex;
  margin-bottom: ${size.s};
  justify-content: space-between;
  gap: ${size.s};
`;
