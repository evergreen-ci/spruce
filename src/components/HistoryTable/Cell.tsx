import styled from "@emotion/styled";
import { uiColors } from "@leafygreen-ui/palette";
import { Skeleton } from "antd";
import { Link } from "react-router-dom";
import { getTaskRoute } from "constants/routes";
import { TaskStatus } from "types/task";
import { HistoryTableIcon } from "./HistoryTableIcon";

const { gray } = uiColors;
const statusIconSize = 20;

interface TaskCellProps {
  task: {
    id: string;
    status: string;
  };
  inactive?: boolean;
  failingTests?: string[];
  label?: string;
  loading: boolean;
}
export const TaskCell: React.FC<TaskCellProps> = ({
  task,
  inactive,
  failingTests,
  label,
  loading,
}) => (
  <Link to={getTaskRoute(task.id)}>
    <Cell aria-disabled={inactive} data-cy="task-cell">
      <HistoryTableIcon
        inactive={inactive}
        status={task.status as TaskStatus}
        failingTests={failingTests}
        label={label}
        loadingTestResults={loading}
      />
    </Cell>
  </Link>
);

export const EmptyCell = () => (
  <Cell data-cy="empty-cell">
    <Circle />
  </Cell>
);

export const LoadingCell = () => (
  <Cell data-cy="loading-cell">
    <Skeleton.Avatar active shape="circle" size={statusIconSize} />
  </Cell>
);

const Circle = styled.div`
  width: ${statusIconSize}px;
  height: ${statusIconSize}px;
  border-radius: 50%;
  border: 2px solid ${gray.light1};
  margin: 0 auto;
`;

const Cell = styled.div`
  display: flex;
  height: 100%;
  width: 150px;
  margin: 0 5px;
  justify-content: center;
  align-items: center;
`;

export const HeaderCell = styled(Cell)`
  word-wrap: anywhere;
  text-align: center;
`;
