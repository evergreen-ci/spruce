import React from "react";
import { uiColors } from "@leafygreen-ui/palette";
import styled from "@emotion/styled";

interface Props {
  diameter?: number;
  percentFill?: number;
}
export const ProgressCircle: React.FC<Props> = ({
  diameter,
  percentFill = 75,
}) => {
  console.log(percentFill);
  const circumference = Math.PI * 10;
  const sliceWidth = circumference * (percentFill / 100);
  const sliceSpace = circumference - sliceWidth;
  return (
    <StyledSVG diameter={diameter} width="20" viewBox="-.5 -.5 21 21">
      <circle r="10" cx="10" cy="10" fill="white" />
      <circle
        r="5"
        cx="10"
        cy="10"
        fill="white"
        stroke={uiColors.blue.base}
        strokeWidth="10"
        strokeDasharray={`${Math.trunc(sliceWidth)} ${Math.trunc(sliceSpace)}`}
      />
      <circle
        cx="10"
        cy="10"
        r="9"
        stroke="white"
        strokeWidth="1"
        fill="none"
      />
      <circle r="10" cx="10" cy="10" stroke={uiColors.blue.base} fill="none" />
    </StyledSVG>
  );
};

const setDimension = ({ diameter }: { diameter?: number }) =>
  diameter ? `${diameter}px` : "20px";

const StyledSVG = styled.svg`
  transform: rotate(-90deg);
  width: ${setDimension};
  height: ${setDimension};
`;
