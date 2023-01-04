import { Body } from "@leafygreen-ui/typography";
import { StyledRouterLink, WordBreak } from "components/styles";
import { getTaskRoute } from "constants/routes";
import { executionAsDisplay } from "pages/task/util/execution";

interface TaskLinkProps {
  taskId: string;
  execution?: number;
  taskName: string;
  onClick?: (taskId: string) => void;
}
export const TaskLink: React.VFC<TaskLinkProps> = ({
  taskId,
  taskName,
  onClick = () => {},
  execution,
}) => (
  <StyledRouterLink onClick={() => onClick(taskId)} to={getTaskRoute(taskId)}>
    <WordBreak>{taskName}</WordBreak>
    <Body>Execution {executionAsDisplay(execution)}</Body>
  </StyledRouterLink>
);
