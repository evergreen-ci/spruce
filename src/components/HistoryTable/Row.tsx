import styled from "@emotion/styled";
import { ListChildComponentProps } from "react-window";
import { CommitChartLabel } from "pages/commits/ActiveCommits/CommitChartLabel";
import { TaskStatus } from "types/task";
import { useHistoryTable } from "./HistoryTableContext";
import { HistoryTableIcon } from "./HistoryTableIcon";
import { rowType } from "./utils";

const Row: React.FC<ListChildComponentProps> = ({ index, style }) => {
  const { isItemLoaded, getItem, visibleColumns } = useHistoryTable();
  if (!isItemLoaded(index)) {
    // TODO: add loading state
    return <div style={style}> Loading....</div>;
  }
  const commit = getItem(index);
  if (commit.type === rowType.DATE_SEPARATOR) {
    // TODO: add date seperator component
    return <DateSeperator style={style}>{commit.date}</DateSeperator>;
  }
  if (commit.type === rowType.COMMIT && commit.commit) {
    const {
      revision,
      createTime,
      author,
      message,
      buildVariants,
    } = commit.commit;

    const orderedColumns = visibleColumns.map((c) => {
      const foundVariant = buildVariants.find((bv) => bv.variant === c);
      if (foundVariant) {
        const { tasks } = foundVariant;
        return (
          <Cell key={`task_cell_${tasks[0].id}`}>
            <HistoryTableIcon status={tasks[0].status as TaskStatus} />
          </Cell>
        );
      }
      // Returned if the build variant did not run for this commit
      return <Cell key={`empty_variant_${c}`}>DNR</Cell>;
    });
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
        {orderedColumns}
      </RowContainer>
    );
  }
  if (commit.type === rowType.FOLDED_COMMITS) {
    // TODO: add folded commits component
    return (
      <FoldedCommitContainer style={style}>
        Expand {commit.rolledUpCommits.length} inactive{" "}
      </FoldedCommitContainer>
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

const Cell = styled.div`
  display: flex;
  height: 100%;
  width: 140px;
  justify-content: center;
  align-items: center;
  :hover {
    cursor: pointer;
  }
`;

const DateSeperator = styled.div`
  width: 100%;
  padding-right: 40px;
  background-color: lightblue;
  display: flex;
  align-items: center;
`;

const FoldedCommitContainer = styled.div`
  width: 100%;
  padding-right: 40px;
  background-color: yellow;
  display: flex;
  align-items: center;
`;
export default Row;
