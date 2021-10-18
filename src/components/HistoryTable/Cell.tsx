import styled from "@emotion/styled";
import { uiColors } from "@leafygreen-ui/palette";
import { Link } from "react-router-dom";
import { getTaskRoute } from "constants/routes";
import { TaskStatus } from "types/task";
import { HistoryTableIcon } from "./HistoryTableIcon";

const { gray } = uiColors;

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

export const EmptyCell = () => (
  <Cell>
    <Circle />
  </Cell>
);
const Circle = styled.div`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 2px solid ${gray.light1};
  margin: 0 auto;
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
