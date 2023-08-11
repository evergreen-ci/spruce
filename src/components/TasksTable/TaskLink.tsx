import { Body } from "@leafygreen-ui/typography";
import { StyledRouterLink, WordBreak } from "components/styles";
import { getTaskRoute } from "constants/routes";
import { formatZeroIndexForDisplay } from "utils/numbers";

interface TaskLinkProps {
  execution?: number;
  onClick?: (taskId: string) => void;
  showTaskExecutionLabel?: boolean;
  taskId: string;
  taskName: string;
}
export const TaskLink: React.FC<TaskLinkProps> = ({
  execution,
  onClick = () => {},
  showTaskExecutionLabel,
  taskId,
  taskName,
}) => (
  <StyledRouterLink
    onClick={() => onClick(taskId)}
    to={getTaskRoute(taskId, { execution })}
  >
    <WordBreak>{taskName}</WordBreak>
    {showTaskExecutionLabel && (
      <Body>Execution {formatZeroIndexForDisplay(execution)}</Body>
    )}
  </StyledRouterLink>
);
