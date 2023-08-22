import styled from "@emotion/styled";
import { Subtitle } from "@leafygreen-ui/typography";
import { size } from "constants/tokens";
import { useDateFormat } from "hooks";

interface Props {
  timestamp: Date;
  user: string;
}

export const Header: React.FC<Props> = ({ timestamp, user }) => {
  const getDateCopy = useDateFormat();

  return (
    <StyledHeader>
      <Subtitle>{getDateCopy(timestamp)}</Subtitle>
      <div>{user}</div>
    </StyledHeader>
  );
};

const StyledHeader = styled.div`
  padding-bottom: ${size.s};
`;
