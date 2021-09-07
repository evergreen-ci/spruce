import styled from "@emotion/styled";
import { ListChildComponentProps } from "react-window";
import { CommitChartLabel } from "pages/commits/ActiveCommits/CommitChartLabel";
import { HistoryTableIcon } from "pages/commits/HistoryTableIcon";
import { TaskStatus } from "types/task";
import { useHistoryTable } from "./HistoryTableContext";

const Row: React.FC<ListChildComponentProps> = ({ index, style }) => {
  const { isItemLoaded, getItem } = useHistoryTable();
  if (!isItemLoaded(index)) {
    return <div style={style}> Loading....</div>;
  }
  const commit = getItem(index);
  if (commit.version) {
    const {
      revision,
      createTime,
      author,
      message,
      buildVariants,
    } = commit.version;
    const tasks = buildVariants.slice(0, 8).map((bv) => bv.tasks[0]);
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
        {tasks.map((task) => (
          <Cell key={`task_cell_${task.id}`}>
            <HistoryTableIcon status={task.status as TaskStatus} />
          </Cell>
        ))}
      </RowContainer>
    );
  }
  return <div>Nothing</div>;
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
    background-color: red;
    cursor: pointer;
  }
`;
export default Row;
