import { useMemo } from "react";
import styled from "@emotion/styled";
import { palette } from "@leafygreen-ui/palette";
import { Accordion } from "components/Accordion";
import CommitChartLabel from "components/CommitChartLabel";
import { EmptyCell, LabelCellContainer } from "components/HistoryTable/Cell";
import {
  FOLDED_COMMITS_HEIGHT,
  COMMIT_HEIGHT,
} from "components/HistoryTable/constants";
import { FoldedCommitsRow } from "components/HistoryTable/types";
import { RowContainer } from "../styles";

const { blue } = palette;

interface FoldedCommitProps {
  index: number;
  numVisibleCols: number;
  selected: boolean;
  data: FoldedCommitsRow;
  onToggleFoldedCommit: (s: {
    expanded: boolean;
    index: number;
    numCommits: number;
  }) => void;
  onClickJiraTicket?: () => void;
  onClickGithash?: () => void;
  onClickUpstreamProject?: () => void;
}
const FoldedCommit: React.VFC<FoldedCommitProps> = ({
  index,
  numVisibleCols,
  selected,
  data,
  onToggleFoldedCommit = () => {},
  onClickGithash,
  onClickJiraTicket,
  onClickUpstreamProject,
}) => {
  const { rolledUpCommits, expanded } = data;
  const defaultOpen = expanded;
  const numCommits = rolledUpCommits.length;

  const columns = useMemo(
    () =>
      Array.from(Array(numVisibleCols)).map((_, idx) => (
        <EmptyCell key={`empty_cell_${idx}`} /> // eslint-disable-line react/no-array-index-key
      )),
    [numVisibleCols]
  );

  const commits = rolledUpCommits.map((commit) => (
    <StyledRowContainer key={commit.id} data-cy="folded-commit">
      <LabelCellContainer>
        <CommitChartLabel
          versionId={commit.id}
          githash={commit.revision}
          createTime={commit.createTime}
          author={commit.author}
          message={commit.message}
          onClickGithash={onClickGithash}
          onClickJiraTicket={onClickJiraTicket}
          upstreamProject={commit.upstreamProject}
          onClickUpstreamProject={onClickUpstreamProject}
        />
      </LabelCellContainer>
      {columns}
    </StyledRowContainer>
  ));

  return (
    <Column selected={selected}>
      <Accordion
        disableAnimation
        title={`Expand ${numCommits} inactive`}
        toggledTitle={`Collapse ${numCommits} inactive`}
        titleTag={AccordionTitle}
        onToggle={({ isVisible }) => {
          onToggleFoldedCommit({ expanded: isVisible, index, numCommits });
        }}
        useIndent={false}
        defaultOpen={defaultOpen}
      >
        {commits}
      </Accordion>
    </Column>
  );
};

const Column = styled.div<{ selected: boolean }>`
  display: flex;
  flex-direction: column;
  ${({ selected }) => selected && `background-color: ${blue.light3}`};
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

export default FoldedCommit;
