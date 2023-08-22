import styled from "@emotion/styled";
import { palette } from "@leafygreen-ui/palette";
import { zIndex } from "constants/tokens";
import { gridHeight } from "pages/commits/constants";

const { gray } = palette;

export const Grid: React.FC<{
  numDashedLine: number;
}> = ({ numDashedLine }) => (
  <ColumnContainer>
    {[...Array(numDashedLine)].map((_, index) => (
      // This value won't change and does not need to represent a unique value
      // eslint-disable-next-line react/no-array-index-key
      <DashedLine key={`${index}_grid_line`} />
    ))}
    <SolidLine />
  </ColumnContainer>
);

const ColumnContainer = styled.div`
  position: absolute;
  top: 0;
  width: 100%;
  height: ${gridHeight}px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-end;
  z-index: ${zIndex.backdrop};
`;

const DashedLine = styled.div`
  width: 100%;
  border: 1px dashed ${gray.light2};
`;

export const SolidLine = styled.div`
  width: 100%;
  border: 1px solid ${gray.light1};
`;
