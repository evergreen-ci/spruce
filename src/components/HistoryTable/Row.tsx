import styled from "@emotion/styled";
import { ListChildComponentProps } from "react-window";
import CommitChartLabel from "components/CommitChartLabel";
import * as Cell from "./Cell";
import { useHistoryTable } from "./HistoryTableContext";
import { DateSeparator } from "./row/DateSeparator";
import { FoldedCommit } from "./row/FoldedCommit";
import { LoadingRow } from "./row/LoadingRow";
import { rowType } from "./types";

interface RowProps extends ListChildComponentProps {
  columns: React.ReactNode[];
  numVisibleCols: number;
}
const Row: React.FC<RowProps> = ({ columns, numVisibleCols, index, style }) => {
  const { isItemLoaded, getItem } = useHistoryTable();
  if (!isItemLoaded(index)) {
    return (
      <RowContainer style={style}>
        <LoadingRow numVisibleCols={numVisibleCols} />
      </RowContainer>
    );
  }
  const commit = getItem(index);
  if (commit.type === rowType.DATE_SEPARATOR) {
    // TODO: add date separator component
    return <DateSeparator style={style} date={commit.date} />;
  }
  if (commit.type === rowType.COMMIT && commit.commit) {
    const { revision, createTime, author, message } = commit.commit;

    return (
      <RowContainer style={style}>
        <LabelCellContainer>
          <CommitChartLabel
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
      <FoldedCommit rolledUpCommits={commit.rolledUpCommits} style={style} />
    );
  }
};

const LabelCellContainer = styled.div`
  width: 200px;
  padding-right: 40px;
`;

const RowContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

export { Cell };
export default Row;
