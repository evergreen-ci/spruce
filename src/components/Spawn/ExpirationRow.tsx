import styled from "@emotion/styled";
import { ObjectFieldTemplateProps } from "@rjsf/utils";
import { size } from "constants/tokens";

export const ExpirationRow: React.VFC<ObjectFieldTemplateProps> = ({
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
