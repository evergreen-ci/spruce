import React from "react";
import styled from "@emotion/styled";
import { uiColors } from "@leafygreen-ui/palette";

const { gray } = uiColors;

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
  width: 100%;
  height: 226px;
  display: flex;
  margin-top: 65px;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-end;
`;

const DashedLine = styled.div`
  width: 100%;
  border: 1px dashed ${gray.light2};
`;

const SolidLine = styled.div`
  width: 100%;
  border: 1px solid ${gray.light1};
`;
