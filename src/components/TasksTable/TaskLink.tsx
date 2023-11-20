import styled from "@emotion/styled";
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
    <WordBreakAll>{taskName}</WordBreakAll>
    {showTaskExecutionLabel && (
      <Body>Execution {formatZeroIndexForDisplay(execution)}</Body>
    )}
  </StyledRouterLink>
);

const WordBreakAll = styled(WordBreak)`
  word-break: break-all;
`;
