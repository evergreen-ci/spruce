import { CSSProperties } from "react";
import styled from "@emotion/styled";
import { uiColors } from "@leafygreen-ui/palette";
import { Body } from "@leafygreen-ui/typography";
import Icon from "components/Icon";
import { size } from "constants/tokens";
import { MainlineCommitsForHistoryQuery } from "gql/generated/types";
import { Unpacked } from "types/utils";

const { gray } = uiColors;
interface FoldedCommitProps {
  rolledUpCommits: Unpacked<
    MainlineCommitsForHistoryQuery["mainlineCommits"]["versions"]
  >["rolledUpVersions"];
  style?: CSSProperties;
}
export const FoldedCommit: React.FC<FoldedCommitProps> = ({
  rolledUpCommits,
  style,
}) => (
  <Column style={style}>
    <Row>
      <Icon fill={gray.dark3} glyph="ChevronRight" />
      <Copy>Expand {rolledUpCommits.length} inactive</Copy>
    </Row>
  </Column>
);

const Column = styled.div`
  cursor: pointer;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const Row = styled.div`
  display: flex;
  align-items: center;
`;

const Copy = styled(Body)`
  margin-left: ${size.xs};
  color: ${gray.dark2};
`;
