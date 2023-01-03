import styled from "@emotion/styled";
import { SpruceFormProps } from "components/SpruceForm/types";
import { size } from "constants/tokens";

export const UserTagRow: SpruceFormProps["ObjectFieldTemplate"] = ({
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
