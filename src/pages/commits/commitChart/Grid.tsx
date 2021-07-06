import React from "react";
import styled from "@emotion/styled";
import { uiColors } from "@leafygreen-ui/palette";

const { gray } = uiColors;

export const Grid: React.FC<{
  numDashedLine: number;
}> = ({ numDashedLine }) => (
  <ColumnContainer>
    {Array.from(Array(numDashedLine).keys()).map((number) => (
      <DashedLine key={number} />
    ))}
    <SolidLine />
  </ColumnContainer>
);

const ColumnContainer = styled.div`
  position: absolute;
  width: 100%;
  height: 224px;
  display: flex;
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
  border: 0.9px solid ${gray.light1};
  z-index: 2;
`;
