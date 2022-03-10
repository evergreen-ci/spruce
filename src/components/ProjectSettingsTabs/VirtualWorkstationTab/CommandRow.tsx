import styled from "@emotion/styled";
import { SpruceFormProps } from "components/SpruceForm";
import { size } from "constants/tokens";

export const CommandRow: SpruceFormProps["ObjectFieldTemplate"] = ({
  properties,
}) => {
  const [command, directory] = properties;

  return (
    <RowContainer data-cy="command-row">
      <LeftColumn>{command.content}</LeftColumn>
      <div>{directory.content}</div>
    </RowContainer>
  );
};

const LeftColumn = styled.div`
  padding-right: ${size.s};
`;

const RowContainer = styled.div`
  display: flex;

  > div {
    flex-grow: 1;
    max-width: 50%;
  }
`;
