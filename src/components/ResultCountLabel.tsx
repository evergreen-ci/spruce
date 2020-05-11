import React from "react";
import styled from "@emotion/styled";
import { P2 } from "./Typography";

interface Props {
  numerator: number;
  denominator: number;
  dataCyNumerator?: string;
  dataCyDenominator?: string;
  label: string;
}
export const ResultCountLabel: React.FC<Props> = ({
  numerator,
  denominator,
  dataCyNumerator,
  dataCyDenominator,
  label,
}) => (
  <StyledP2>
    <span data-cy={dataCyNumerator}>{numerator}</span>/
    <span data-cy={dataCyDenominator}>{denominator}</span>
    <span> {label}</span>
  </StyledP2>
);

const StyledP2 = styled(P2)`
  position: relative;
  top: 5px;
`;
