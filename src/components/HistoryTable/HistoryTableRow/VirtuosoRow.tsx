import CommitChartLabel from "components/CommitChartLabel";
import { types } from "..";
import { LabelCellContainer } from "../Cell/Cell";
import { useHistoryTable } from "../HistoryTableContext";
import { rowType } from "../types";
import { DateSeparator } from "./DateSeparator";
import { FoldedCommit } from "./FoldedCommit";
import { LoadingRow } from "./LoadingRow";
import { RowContainer } from "./styles";

interface RowProps {
  columns: React.ReactNode[];
  numVisibleCols: number;
  selected: boolean;
  onClickGithash: () => void;
  onClickJiraTicket: () => void;
  onClickFoldedGithash: () => void;
  onClickFoldedJiraTicket: () => void;
  onClickFoldedUpstreamProject: () => void;
  onClickUpstreamProject: () => void;
  onToggleFoldedCommit: (s: { isVisible: boolean }) => void;
  index: number;
  data: types.CommitRowType;
}
const VirtuosoRow: React.VFC<RowProps> = ({
  columns,
  numVisibleCols,
  index,
  selected,
  data,
  onClickGithash,
  onClickJiraTicket,
  onClickUpstreamProject,
  onClickFoldedGithash,
  onClickFoldedJiraTicket,
  onClickFoldedUpstreamProject,
  onToggleFoldedCommit,
}) => {
  const { isItemLoaded, columnLimit } = useHistoryTable();
  if (!isItemLoaded(index)) {
    return (
      <RowContainer>
        <LoadingRow numVisibleCols={numVisibleCols || columnLimit} />
      </RowContainer>
    );
  }

  if (data.type === rowType.DATE_SEPARATOR) {
    return <DateSeparator date={data.date} />;
  }
  if (data.type === rowType.COMMIT && data.commit) {
    const {
      revision,
      createTime,
      author,
      message,
      id: versionId,
      upstreamProject,
    } = data.commit;

    return (
      <RowContainer data-selected={selected} selected={selected}>
        <LabelCellContainer>
          <CommitChartLabel
            versionId={versionId}
            githash={revision}
            createTime={createTime}
            author={author}
            message={message}
            onClickGithash={onClickGithash}
            onClickJiraTicket={onClickJiraTicket}
            upstreamProject={upstreamProject}
            onClickUpstreamProject={onClickUpstreamProject}
          />
        </LabelCellContainer>
        {columns}
      </RowContainer>
    );
  }
  if (data.type === rowType.FOLDED_COMMITS) {
    return (
      <FoldedCommit
        index={index}
        rolledUpCommits={data.rolledUpCommits}
        numVisibleCols={numVisibleCols || columnLimit}
        selected={selected}
        onClickGithash={onClickFoldedGithash}
        onClickJiraTicket={onClickFoldedJiraTicket}
        onToggleFoldedCommit={({ isVisible }) => {
          onToggleFoldedCommit({ isVisible });
        }}
        onClickUpstreamProject={onClickFoldedUpstreamProject}
      />
    );
  }
};

export default VirtuosoRow;
