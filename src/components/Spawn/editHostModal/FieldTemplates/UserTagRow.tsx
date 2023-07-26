import styled from "@emotion/styled";
import { ObjectFieldTemplateProps } from "@rjsf/utils";
import { size } from "constants/tokens";

export const UserTagRow: React.VFC<ObjectFieldTemplateProps> = ({
  properties,
}) => {
  const [key, value] = properties;

  return (
    <UserTagContainer>
      <div>{key.content}</div>
      <div>{value.content}</div>
    </UserTagContainer>
  );
};

const UserTagContainer = styled.div`
  display: flex;
  margin-bottom: ${size.s};
  gap: ${size.s};
`;
