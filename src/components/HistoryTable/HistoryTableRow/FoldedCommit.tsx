import styled from "@emotion/styled";
import { palette } from "@leafygreen-ui/palette";
import { Accordion } from "components/Accordion";
import CommitChartLabel from "components/CommitChartLabel";
import { MainlineCommitsForHistoryQuery } from "gql/generated/types";
import { Unpacked } from "types/utils";
import { EmptyCell, LabelCellContainer } from "../Cell/Cell";
import { FOLDED_COMMITS_HEIGHT, COMMIT_HEIGHT } from "../constants";
import { RowContainer } from "./styles";

const { blue } = palette;

interface FoldedCommitProps {
  index: number;
  rolledUpCommits: Unpacked<
    MainlineCommitsForHistoryQuery["mainlineCommits"]["versions"]
  >["rolledUpVersions"];
  numVisibleCols: number;
  selected: boolean;
  onToggleFoldedCommit: (s: {
    isVisible: boolean;
    index: number;
    numCommits: number;
  }) => void;
  onClickJiraTicket?: () => void;
  onClickGithash?: () => void;
  onClickUpstreamProject?: () => void;
}
export const FoldedCommit: React.VFC<FoldedCommitProps> = ({
  index,
  rolledUpCommits,
  numVisibleCols,
  selected,
  onToggleFoldedCommit = () => {},
  onClickGithash,
  onClickJiraTicket,
  onClickUpstreamProject,
}) => {
  const defaultOpen = false;
  const numCommits = rolledUpCommits.length;

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
          onToggleFoldedCommit({ isVisible, index, numCommits });
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
