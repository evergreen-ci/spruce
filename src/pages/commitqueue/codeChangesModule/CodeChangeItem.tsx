import React from "react";
import styled from "@emotion/styled";
import { FileDiff } from "types/patch";
import { StyledLink } from "components/styles/StyledLink";
import { uiColors } from "@leafygreen-ui/palette";

const { green, red, gray } = uiColors;
const CodeChangeItemRow = styled("div")`
  display: grid;
  ${(props: { isLastItem: boolean }) =>
    !props.isLastItem && `border-bottom: 1px solid ${gray.light2};`}
  grid-template-columns: 4fr repeat(2, 1fr);
  grid-template-rows: 1fr;
  grid-column-gap: 0px;
  grid-row-gap: 0px;
  width: 70%;
`;

const CodeChangeItemGridField = styled("div")`
  grid-area: ${(props: { grid: string }) => props.grid};
  margin: 16px 0 16px 0;
`;

const FileDiffTextContainer = styled("span")`
  ${(props: { type: string; hasValue: boolean }) =>
    props.hasValue &&
    (props.type === "+" ? `color: ${green.base};` : `color: ${red.base};`)}
  &:nth-child(2) {
    margin-left: 16px;
  }
`;
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

interface CodeChangeItemProps extends FileDiff {
  isLastItem: boolean;
}
export const CodeChangeItem: React.FC<CodeChangeItemProps> = ({
  fileName,
  diffLink,
  additions,
  deletions,
  isLastItem
}) => {
  return (
    <CodeChangeItemRow isLastItem={isLastItem}>
      <CodeChangeItemGridField grid="1 / 1 / 2 / 2">
        <StyledLink href={diffLink}>{fileName}</StyledLink>
      </CodeChangeItemGridField>
      <CodeChangeItemGridField grid="1 / 2 / 2 / 3">
        <FileDiffText value={additions} type="+" />
      </CodeChangeItemGridField>
      <CodeChangeItemGridField grid="1 / 3 / 2 / 4">
        <FileDiffText value={deletions} type="-" />
      </CodeChangeItemGridField>
    </CodeChangeItemRow>
  );
};
