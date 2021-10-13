import styled from "@emotion/styled";
import { ListChildComponentProps } from "react-window";
import CommitChartLabel from "components/CommitChartLabel";
import { useHistoryTable } from "./HistoryTableContext";
import * as Cell from "./row/Cell";
import { DateSeparator } from "./row/DateSeparator";
import { FoldedCommit } from "./row/FoldedCommit";
import { rowType } from "./types";

interface RowProps extends ListChildComponentProps {
  columns: React.ReactNode[];
}
const Row: React.FC<RowProps> = ({ columns, index, style }) => {
  const { isItemLoaded, getItem } = useHistoryTable();
  if (!isItemLoaded(index)) {
    // TODO: add loading state
    return <div style={style}> Loading....</div>;
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
`;

export { Cell };
export default Row;
