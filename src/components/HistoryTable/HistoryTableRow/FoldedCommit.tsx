import { CSSProperties, memo } from "react";
import styled from "@emotion/styled";
import { uiColors } from "@leafygreen-ui/palette";
import { areEqual } from "react-window";
import { Accordion } from "components/Accordion";
import CommitChartLabel from "components/CommitChartLabel";
import { MainlineCommitsForHistoryQuery } from "gql/generated/types";
import { Unpacked } from "types/utils";
import { EmptyCell, LabelCellContainer } from "../Cell/Cell";
import {
  FOLDED_COMMITS_HEIGHT,
  COMMIT_HEIGHT,
  LOADING_HEIGHT,
} from "../constants";
import { RowContainer } from "./styles";

const { blue } = uiColors;

interface FoldedCommitProps {
  index: number;
  rolledUpCommits: Unpacked<
    MainlineCommitsForHistoryQuery["mainlineCommits"]["versions"]
  >["rolledUpVersions"];
  toggleRowSize: (idx: number, numCommits: number) => void;
  numVisibleCols: number;
  style?: CSSProperties;
  selected: boolean;
  onToggleFoldedCommit?: (s: { isVisible: boolean }) => void;
  onClickJiraTicket?: () => void;
  onClickGithash?: () => void;
}
export const FoldedCommit = memo<FoldedCommitProps>(
  ({
    index,
    rolledUpCommits,
    toggleRowSize,
    numVisibleCols,
    style,
    selected,
    onToggleFoldedCommit = () => {},
    onClickGithash,
    onClickJiraTicket,
  }: FoldedCommitProps) => {
    const { height } = style;

    // The virtualized table will unmount the row when it is scrolled out of view but it will cache its height in memory.
    // This means we can't rely on the state of the row to determine if it is expanded or not.
    // So we instead look at its height which is cached by the table and determine if it is expanded or not.
    // It will be expanded if the height is not one of the 2 default values.
    const defaultOpen =
      height !== FOLDED_COMMITS_HEIGHT && height !== LOADING_HEIGHT;
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
          />
        </LabelCellContainer>
        {columns}
      </StyledRowContainer>
    ));

    return (
      <Column style={style} selected={selected}>
        <Accordion
          title={`Expand ${numCommits} inactive`}
          toggledTitle={`Collapse ${numCommits} inactive`}
          titleTag={AccordionTitle}
          onToggle={({ isVisible }) => {
            onToggleFoldedCommit({ isVisible });
            toggleRowSize(index, numCommits);
          }}
          useIndent={false}
          defaultOpen={defaultOpen}
        >
          {commits}
        </Accordion>
      </Column>
    );
  },
  areEqual
);

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
