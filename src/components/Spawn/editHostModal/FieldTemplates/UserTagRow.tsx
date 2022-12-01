import styled from "@emotion/styled";
import { ObjectFieldTemplateProps } from "@rjsf/core";
import { size } from "constants/tokens";
import { form } from "pages/projectSettings/tabs/utils";

const { getFields } = form;

export const UserTagRow: React.VFC<
  Pick<ObjectFieldTemplateProps, "formData" | "properties" | "uiSchema">
> = ({ formData, properties }) => {
  const [key, value] = getFields(properties, formData.isDisabled);

  return (
    <UserTagContainer>
      <div>{key}</div>
      <div>{value}</div>
    </UserTagContainer>
  );
};

const UserTagContainer = styled.div`
  display: flex;
  margin-bottom: ${size.s};
  gap: ${size.s};
`;
