import styled from "@emotion/styled";
import { ObjectFieldTemplateProps } from "@rjsf/utils";
import { size } from "constants/tokens";

export const CommandRow: React.VFC<ObjectFieldTemplateProps> = ({
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
  flex-grow: 1;
`;

const RowContainer = styled.div`
  display: flex;
`;
