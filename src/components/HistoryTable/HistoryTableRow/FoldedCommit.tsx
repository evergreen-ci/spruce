import { CSSProperties } from "react";
import styled from "@emotion/styled";
import { Accordion } from "components/Accordion";
import CommitChartLabel from "components/CommitChartLabel";
import { MainlineCommitsForHistoryQuery } from "gql/generated/types";
import { Unpacked } from "types/utils";
import { EmptyCell } from "../Cell/Cell";
import { FOLDED_COMMITS_HEIGHT, COMMIT_HEIGHT } from "../constants";
import { LabelCellContainer, RowContainer } from "./styles";

interface FoldedCommitProps {
  index: number;
  rolledUpCommits: Unpacked<
    MainlineCommitsForHistoryQuery["mainlineCommits"]["versions"]
  >["rolledUpVersions"];
  toggleRow: (idx: number, numCommits: number) => void;
  numVisibleCols: number;
  style?: CSSProperties;
}
export const FoldedCommit: React.FC<FoldedCommitProps> = ({
  index,
  rolledUpCommits,
  toggleRow,
  numVisibleCols,
  style,
}) => {
  // The commits are expanded if the height of the element is not equal to FOLDED_COMMITS_HEIGHT.
  const { height } = style;
  const defaultOpen = height !== FOLDED_COMMITS_HEIGHT;

  const columns = Array.from(Array(numVisibleCols)).map((_, idx) => (
    <EmptyCell key={`loading_row_${idx}`} /> // eslint-disable-line react/no-array-index-key
  ));

  const commits = rolledUpCommits.map((commit) => (
    <StyledRowContainer key={commit.id}>
      <LabelCellContainer>
        <CommitChartLabel
          versionId={commit.id}
          githash={commit.revision}
          createTime={commit.createTime}
          author={commit.author}
          message={commit.message}
        />
      </LabelCellContainer>
      {columns}
    </StyledRowContainer>
  ));

  return (
    <Column style={style}>
      <Accordion
        title={`Expand ${rolledUpCommits.length} inactive`}
        toggledTitle={`Collapse ${rolledUpCommits.length} inactive`}
        titleTag={AccordionTitle}
        contents={commits}
        defaultOpen={defaultOpen}
        onClick={() => toggleRow(index, rolledUpCommits.length)}
        useIndent={false}
      />
    </Column>
  );
};

const Column = styled.div`
  display: flex;
  flex-direction: column;
`;

const AccordionTitle = styled.div`
  display: flex;
  align-items: center;
  height: ${FOLDED_COMMITS_HEIGHT}px;
  cursor: pointer;
`;

const StyledRowContainer = styled(RowContainer)`
  height: ${COMMIT_HEIGHT}px;
  opacity: 60%;
`;
