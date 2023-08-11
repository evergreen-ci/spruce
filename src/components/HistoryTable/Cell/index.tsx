import styled from "@emotion/styled";
import { palette } from "@leafygreen-ui/palette";
import Tooltip from "@leafygreen-ui/tooltip";
import { Skeleton } from "antd";
import { Link } from "react-router-dom";
import { ConditionalWrapper } from "components/ConditionalWrapper";
import { inactiveElementStyle, StyledRouterLink } from "components/styles";
import { getTaskRoute } from "constants/routes";
import { size } from "constants/tokens";
import { TaskStatus } from "types/task";
import { COLUMN_LABEL_WIDTH, ROW_LABEL_WIDTH } from "../constants";
import { HistoryTableIcon } from "../HistoryTableIcon";

const { gray } = palette;
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
  onClick?: ({ taskStatus }: { taskStatus: string }) => void;
}

const TaskCell: React.FC<TaskCellProps> = ({
  failingTests,
  inactive,
  label,
  loading = false,
  onClick = () => {},
  task,
}) => (
  <Cell inactive={inactive} aria-disabled={inactive} data-cy="task-cell">
    <Link
      onClick={() => {
        onClick({ taskStatus: task.status });
      }}
      to={getTaskRoute(task.id)}
    >
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

const EmptyCell = () => (
  <Cell data-cy="empty-cell">
    <Circle />
  </Cell>
);

interface LoadingCellProps {
  isHeader?: boolean;
}
const LoadingCell: React.FC<LoadingCellProps> = ({ isHeader = false }) =>
  isHeader ? (
    <HeaderCell data-cy="loading-header-cell">
      <Skeleton active title paragraph={false} />
    </HeaderCell>
  ) : (
    <Cell data-cy="loading-cell">
      <Skeleton.Avatar active shape="circle" size={statusIconSize} />
    </Cell>
  );

interface ColumnHeaderCellProps {
  link: string;
  trimmedDisplayName: string;
  fullDisplayName: string;
  onClick?: () => void;
}
const ColumnHeaderCell: React.FC<ColumnHeaderCellProps> = ({
  fullDisplayName,
  link,
  onClick,
  trimmedDisplayName,
}) => (
  <HeaderCell data-cy="header-cell">
    <ConditionalWrapper
      condition={trimmedDisplayName !== fullDisplayName}
      wrapper={(children) => (
        <Tooltip
          align="top"
          justify="middle"
          trigger={children}
          triggerEvent="hover"
        >
          {fullDisplayName}
        </Tooltip>
      )}
    >
      <StyledRouterLink onClick={onClick} to={link}>
        {trimmedDisplayName}
      </StyledRouterLink>
    </ConditionalWrapper>
  </HeaderCell>
);

const Circle = styled.div`
  width: ${statusIconSize}px;
  height: ${statusIconSize}px;
  border-radius: 50%;
  border: 2px solid ${gray.light1};
  margin: 0 auto;
`;

const BaseCell = styled.div`
  display: flex;
  height: 100%;
  width: ${COLUMN_LABEL_WIDTH}px;
  margin: 0 ${size.xs};
  justify-content: center;
`;

const Cell = styled(BaseCell)<{ inactive?: boolean }>`
  align-items: center;
  ${({ inactive }) => inactive && inactiveElementStyle}
`;

const HeaderCell = styled(BaseCell)`
  word-break: break-all; // Safari
  word-wrap: anywhere;
  text-align: center;
  height: ${size.xxl};
  padding: ${size.xs} 0;
`;

// LabelCellContainer is used to provide padding for the first column in the table since we do not have a header for it
const LabelCellContainer = styled.div`
  width: ${ROW_LABEL_WIDTH}px;
  margin-right: 40px;
`;

export {
  LabelCellContainer,
  ColumnHeaderCell,
  LoadingCell,
  TaskCell,
  EmptyCell,
};
