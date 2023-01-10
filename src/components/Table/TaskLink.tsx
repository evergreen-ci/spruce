import { Body } from "@leafygreen-ui/typography";
import { StyledRouterLink, WordBreak } from "components/styles";
import { getTaskRoute } from "constants/routes";
import { executionAsDisplay } from "utils/task";

interface TaskLinkProps {
  execution?: number;
  onClick?: (taskId: string) => void;
  taskId: string;
  taskName: string;
}
export const TaskLink: React.VFC<TaskLinkProps> = ({
  execution,
  onClick = () => {},
  taskId,
  taskName,
}) => (
  <StyledRouterLink onClick={() => onClick(taskId)} to={getTaskRoute(taskId)}>
    <WordBreak>{taskName}</WordBreak>
    {Number.isInteger(execution) && (
      <Body>Execution {executionAsDisplay(execution)}</Body>
    )}
  </StyledRouterLink>
);
