import styled from "@emotion/styled";
import { palette } from "@leafygreen-ui/palette";
import { size } from "constants/tokens";

const { blue } = palette;

export const FlexRowContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;
`;

export const CommitWrapper = styled.div<{
  width: number;
  selected?: boolean;
}>`
  background-color: ${({ selected }) =>
    selected ? blue.light3 : "transparent"};
  width: ${({ width }) => width}px;
  min-width: ${({ width }) => width * 0.75}px;
  align-self: stretch;
  margin: 0px ${size.xs};

  &:first-of-type {
    margin-left: 0;
  }
  &:last-of-type {
    margin-right: 0;
  }
`;
