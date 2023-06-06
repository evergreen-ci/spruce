import CommitChartLabel from "components/CommitChartLabel";
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
  data: any;
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
  console.log(data);
  const { isItemLoaded, getItem, columnLimit } = useHistoryTable();
  if (!isItemLoaded(index)) {
    return (
      <RowContainer>
        <LoadingRow numVisibleCols={numVisibleCols || columnLimit} />
      </RowContainer>
    );
  }
  const commit = getItem(index);
  if (commit.type === rowType.DATE_SEPARATOR) {
    return <DateSeparator date={commit.date} />;
  }
  if (commit.type === rowType.COMMIT && commit.commit) {
    const {
      revision,
      createTime,
      author,
      message,
      id: versionId,
      upstreamProject,
    } = commit.commit;

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
  if (commit.type === rowType.FOLDED_COMMITS) {
    return (
      <FoldedCommit
        index={index}
        rolledUpCommits={commit.rolledUpCommits}
        toggleRowSize={data.toggleRowSize}
        numVisibleCols={numVisibleCols || columnLimit}
        selected={selected}
        onClickGithash={onClickFoldedGithash}
        onClickJiraTicket={onClickFoldedJiraTicket}
        onToggleFoldedCommit={onToggleFoldedCommit}
        onClickUpstreamProject={onClickFoldedUpstreamProject}
      />
    );
  }
};

export default VirtuosoRow;
