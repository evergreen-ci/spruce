import { ListChildComponentProps } from "react-window";
import CommitChartLabel from "components/CommitChartLabel";
import { useHistoryTable } from "../HistoryTableContext";
import { rowType } from "../types";
import { DateSeparator } from "./DateSeparator";
import { FoldedCommit } from "./FoldedCommit";
import { LoadingRow } from "./LoadingRow";
import { LabelCellContainer, RowContainer } from "./styles";

interface RowProps extends ListChildComponentProps {
  columns: React.ReactNode[];
  numVisibleCols: number;
  selected: boolean;
}
const Row: React.FC<RowProps> = ({
  columns,
  numVisibleCols,
  index,
  style,
  selected,
  data,
}) => {
  const { isItemLoaded, getItem, columnLimit } = useHistoryTable();
  if (!isItemLoaded(index)) {
    return (
      <RowContainer selected={selected} style={style}>
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
      <RowContainer selected={selected} style={style}>
        <LabelCellContainer>
          <CommitChartLabel
            versionId={versionId}
            githash={revision}
            createTime={createTime}
            author={author}
            message={message}
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
      />
    );
  }
};

export default Row;
