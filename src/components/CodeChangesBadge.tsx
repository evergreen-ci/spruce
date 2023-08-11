import styled from "@emotion/styled";
import Badge from "@leafygreen-ui/badge";
import { palette } from "@leafygreen-ui/palette";
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

export const FileDiffText: React.FC<FileDiffTextProps> = ({ type, value }) => {
  const hasValue = value > 0;
  return (
    <FileDiffTextContainer hasValue={hasValue} type={type}>
      {hasValue && type}
      {value}
    </FileDiffTextContainer>
  );
};

const { green, red } = palette;

const FileDiffTextContainer = styled("span")`
  ${(props: { type: string; hasValue: boolean }): string =>
    props.hasValue &&
    (props.type === "+" ? `color: ${green.dark1};` : `color: ${red.base};`)}
  &:nth-of-type(2) {
    margin-left: ${size.s};
  }
`;
