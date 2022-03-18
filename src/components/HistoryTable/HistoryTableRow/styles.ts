import styled from "@emotion/styled";
import { uiColors } from "@leafygreen-ui/palette";

const { blue } = uiColors;
export const LabelCellContainer = styled.div`
  width: 200px;
  padding-right: 40px;
`;

export const RowContainer = styled.div<{ selected?: boolean }>`
  display: flex;
  flex-direction: row;
  align-items: center;
  background-color: ${({ selected }) => (selected ? blue.light3 : "white")};
`;
