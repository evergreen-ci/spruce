import styled from "@emotion/styled";
import { palette } from "@leafygreen-ui/palette";
import { size } from "constants/tokens";

const { blue, gray } = palette;

export const LabelCellContainer = styled.div`
  min-width: 200px;
  padding-right: 40px;
`;

export const RowContainer = styled.div<{ selected?: boolean }>`
  display: flex;
  flex-direction: row;
  align-items: center;
  ${({ selected }) => selected && `background-color: ${blue.light3};`};
`;

export const DashedLine = styled.div`
  margin-top: 2px;
  height: 1px;
  background: linear-gradient(to right, transparent 50%, white 50%),
    linear-gradient(to right, ${gray.light1}, ${gray.light1});
  background-size:
    ${size.s} 2px,
    100% 2px;
  width: 100%;
`;
