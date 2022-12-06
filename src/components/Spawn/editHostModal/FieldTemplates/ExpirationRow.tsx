import styled from "@emotion/styled";
import { SpruceFormProps } from "components/SpruceForm/types";
import { size } from "constants/tokens";

export const ExpirationRow: SpruceFormProps["ObjectFieldTemplate"] = ({
  properties,
}) => {
  const [expiration, noExpiration] = properties;

  return (
    <ExpirationContainer>
      <div>{expiration.content}</div>
      <div>or</div>
      <div>{noExpiration.content}</div>
    </ExpirationContainer>
  );
};

const ExpirationContainer = styled.div`
  display: flex;
  align-items: center;
  gap: ${size.xs};
`;
