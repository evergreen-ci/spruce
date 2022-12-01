import styled from "@emotion/styled";
import { ObjectFieldTemplateProps } from "@rjsf/core";
import { size } from "constants/tokens";
import { form } from "pages/projectSettings/tabs/utils";

const { getFields } = form;

export const ExpirationRow: React.VFC<
  Pick<ObjectFieldTemplateProps, "formData" | "properties" | "uiSchema">
> = ({ formData, properties }) => {
  const [expiration, noExpiration] = getFields(properties, formData.isDisabled);

  return (
    <ExpirationContainer>
      <div>{expiration}</div>
      <div>or</div>
      <div>{noExpiration}</div>
    </ExpirationContainer>
  );
};

const ExpirationContainer = styled.div`
  display: flex;
  align-items: center;
  gap: ${size.xs};
`;
