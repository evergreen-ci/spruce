import styled from "@emotion/styled";
import { palette } from "@leafygreen-ui/palette";
import { Body, BodyProps } from "@leafygreen-ui/typography";
import { size } from "constants/tokens";
import { DashedLine } from "../BaseRow/styles";

const { gray } = palette;

interface EndOfHistoryRowProps {
  children: string;
}
const EndOfHistoryRow: React.FC<EndOfHistoryRowProps> = ({ children }) => (
  <Row>
    <DashedLine />
    <StyledBody weight="medium">{children}</StyledBody>
    <DashedLine />
  </Row>
);

const Row = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: ${size.l};
`;

const StyledBody = styled(Body)<BodyProps>`
  white-space: nowrap;
  color: ${gray.dark2};
  text-transform: uppercase;
`;

export default EndOfHistoryRow;
