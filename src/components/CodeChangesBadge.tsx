import React from "react";
import styled from "@emotion/styled";
import Badge from "@leafygreen-ui/badge";
import { uiColors } from "@leafygreen-ui/palette";
import { size } from "constants/tokens";

interface Props {
  additions: number;
  deletions: number;
}

export const CodeChangesBadge: React.FC<Props> = ({ additions, deletions }) => (
  <Badge>
    <FileDiffText type="+" value={additions} />
    <FileDiffText type="-" value={deletions} />
  </Badge>
);

interface FileDiffTextProps {
  type: string;
  value: number;
}

export const FileDiffText: React.FC<FileDiffTextProps> = ({ value, type }) => {
  const hasValue = value > 0;
  return (
    <FileDiffTextContainer hasValue={hasValue} type={type}>
      {hasValue && type}
      {value}
    </FileDiffTextContainer>
  );
};

const { green, red } = uiColors;

const FileDiffTextContainer = styled("span")`
  ${(props: { type: string; hasValue: boolean }): string =>
    props.hasValue &&
    (props.type === "+" ? `color: ${green.base};` : `color: ${red.base};`)}
  &:nth-of-type(2) {
    margin-left: ${size.s};
  }
`;
