import React from "react";
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
  <P2>
    <span data-cy={dataCyNumerator}>{numerator}</span>/
    <span data-cy={dataCyDenominator}>{denominator}</span>
    <span> {label}</span>
  </P2>
);
