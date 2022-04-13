import { ListChildComponentProps } from "react-window";
import CommitChartLabel from "components/CommitChartLabel";
import { LabelCellContainer } from "../Cell/Cell";
import { useHistoryTable } from "../HistoryTableContext";
import { rowType } from "../types";
import { DateSeparator } from "./DateSeparator";
import { FoldedCommit } from "./FoldedCommit";
import { LoadingRow } from "./LoadingRow";
import { RowContainer } from "./styles";

interface RowProps extends ListChildComponentProps {
  columns: React.ReactNode[];
  numVisibleCols: number;
  selected: boolean;
  onClickGithash: () => void;
  onClickJiraTicket: () => void;
  onClickFoldedGithash: () => void;
  onClickFoldedJiraTicket: () => void;
  onToggleFoldedCommit: (isVisible: boolean) => void;
}
const Row: React.VFC<RowProps> = ({
  columns,
  numVisibleCols,
  index,
  style,
  selected,
  data,
  onClickGithash,
  onClickJiraTicket,
  onClickFoldedGithash,
  onClickFoldedJiraTicket,
  onToggleFoldedCommit,
}) => {
  const { isItemLoaded, getItem, columnLimit } = useHistoryTable();
  if (!isItemLoaded(index)) {
    return (
      <RowContainer style={style}>
        <LoadingRow numVisibleCols={numVisibleCols || columnLimit} />
      </RowContainer>
    );
  }
  const commit = getItem(index);
  if (commit.type === rowType.DATE_SEPARATOR) {
    return <DateSeparator style={style} date={commit.date} />;
  }
  if (commit.type === rowType.COMMIT && commit.commit) {
    const {
      revision,
      createTime,
      author,
      message,
      id: versionId,
    } = commit.commit;

    return (
      <RowContainer data-selected={selected} selected={selected} style={style}>
        <LabelCellContainer>
          <CommitChartLabel
            versionId={versionId}
            githash={revision}
            createTime={createTime}
            author={author}
            message={message}
            onClickGithash={onClickGithash}
            onClickJiraTicket={onClickJiraTicket}
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
        style={style}
        selected={selected}
        onClickGithash={onClickFoldedGithash}
        onClickJiraTicket={onClickFoldedJiraTicket}
        onToggleFoldedCommit={onToggleFoldedCommit}
      />
    );
  }
};

export default Row;
