import styled from "@emotion/styled";
import { Link } from "react-router-dom";
import { ListChildComponentProps } from "react-window";
import CommitChartLabel from "components/CommitChartLabel";
import { getTaskRoute } from "constants/routes";
import { TaskStatus } from "types/task";
import { useHistoryTable } from "./HistoryTableContext";
import { HistoryTableIcon } from "./HistoryTableIcon";
import { DateSeparator } from "./row/DateSeparator";
import { rowType } from "./utils";

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
    // TODO: add folded commits component
    return (
      <FoldedCommitContainer style={style}>
        Expand {commit.rolledUpCommits.length} inactive{" "}
      </FoldedCommitContainer>
    );
  }
};

interface TaskCellProps {
  task: {
    id: string;
    status: string;
  };
}
export const TaskCell: React.FC<TaskCellProps> = ({ task }) => (
  <Link key={task.id} to={getTaskRoute(task.id)}>
    <Cell key={`task_cell_${task.id}`}>
      <HistoryTableIcon status={task.status as TaskStatus} />
    </Cell>
  </Link>
);

const LabelCellContainer = styled.div`
  width: 200px;
  padding-right: 40px;
`;

const RowContainer = styled.div`
  display: flex;
  flex-direction: row;
`;

export const Cell = styled.div`
  display: flex;
  height: 100%;
  width: 140px;
  justify-content: center;
  align-items: center;
  :hover {
    cursor: pointer;
  }
`;

const FoldedCommitContainer = styled.div`
  width: 100%;
  padding-right: 40px;
  background-color: yellow;
  display: flex;
  align-items: center;
`;
export default Row;
