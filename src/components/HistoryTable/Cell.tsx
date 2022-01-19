import styled from "@emotion/styled";
import { uiColors } from "@leafygreen-ui/palette";
import Tooltip from "@leafygreen-ui/tooltip";
import { Skeleton } from "antd";
import { Link } from "react-router-dom";
import { inactiveElementStyle, StyledRouterLink } from "components/styles";
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
  loading?: boolean;
}
export const TaskCell: React.FC<TaskCellProps> = ({
  task,
  inactive,
  failingTests,
  label,
  loading = false,
}) => (
  <Cell inactive={inactive} aria-disabled={inactive} data-cy="task-cell">
    <Link to={getTaskRoute(task.id)}>
      <HistoryTableIcon
        inactive={inactive}
        status={task.status as TaskStatus}
        failingTests={failingTests}
        label={label}
        loadingTestResults={loading}
      />
    </Link>
  </Cell>
);

export const EmptyCell = () => (
  <Cell data-cy="empty-cell">
    <Circle />
  </Cell>
);

interface LoadingCellProps {
  isHeader?: boolean;
}
export const LoadingCell: React.FC<LoadingCellProps> = ({
  isHeader = false,
}) => (
  <>
    {isHeader ? (
      <HeaderCell data-cy="loading-header-cell">
        <Skeleton active title paragraph={false} />
      </HeaderCell>
    ) : (
      <Cell data-cy="loading-cell">
        <Skeleton.Avatar active shape="circle" size={statusIconSize} />
      </Cell>
    )}
  </>
);

interface ColumnHeaderCellProps {
  link: string;
  trimmedDisplayName: string;
  fullDisplayName: string;
}
export const ColumnHeaderCell: React.FC<ColumnHeaderCellProps> = ({
  link,
  trimmedDisplayName,
  fullDisplayName,
}) => (
  <HeaderCell data-cy="header-cell">
    {trimmedDisplayName === fullDisplayName ? (
      <StyledRouterLink to={link}>{fullDisplayName}</StyledRouterLink>
    ) : (
      <Tooltip
        align="top"
        justify="middle"
        trigger={
          <StyledRouterLink to={link}>{trimmedDisplayName}</StyledRouterLink>
        }
        triggerEvent="hover"
      >
        {fullDisplayName}
      </Tooltip>
    )}
  </HeaderCell>
);

const Circle = styled.div`
  width: ${statusIconSize}px;
  height: ${statusIconSize}px;
  border-radius: 50%;
  border: 2px solid ${gray.light1};
  margin: 0 auto;
`;

const Cell = styled.div<{ inactive?: boolean }>`
  display: flex;
  height: 100%;
  width: 150px;
  margin: 0 5px;
  justify-content: center;
  align-items: center;
  ${({ inactive }) => inactive && inactiveElementStyle}
`;

export const HeaderCell = styled(Cell)`
  word-wrap: anywhere;
  word-break: break-word; // Safari
  text-align: center;
`;
