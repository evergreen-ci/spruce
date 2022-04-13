import styled from "@emotion/styled";
import { uiColors } from "@leafygreen-ui/palette";
import Icon from "components/Icon";
import { size } from "constants/tokens";

const { gray } = uiColors;

interface Props {
  message: string;
}

export const NoTableResults: React.VFC<Props> = ({ message }) => (
  <NoResults>
    <Icon glyph="CurlyBraces" size="large" />
    <Message> {message} </Message>
  </NoResults>
);

const NoResults = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: ${size.l} 0;
  background-color: ${gray.light2};
  opacity: 50%;
`;

const Message = styled.div`
  margin-top: ${size.xs};
`;
