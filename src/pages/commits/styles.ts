import styled from "@emotion/styled";
import { size } from "constants/tokens";

export const FlexRowContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;
`;

export const CommitWrapper = styled.div<{ width: number }>`
  width: ${({ width }) => width}px;
  min-width: ${({ width }) => width * 0.75}px;
  margin: 0px ${size.xs};

  &:first-of-type {
    margin-left: 0;
  }
  &:last-of-type {
    margin-right: 0;
  }
`;
