import { StyledRouterLink, WordBreak } from "components/styles";
import { getTaskRoute } from "constants/routes";

interface TaskLinkProps {
  taskId: string;
  taskName: string;
  onClick?: (taskId: string) => void;
}
export const TaskLink: React.VFC<TaskLinkProps> = ({
  taskId,
  taskName,
  onClick = () => {},
}) => (
  <StyledRouterLink onClick={() => onClick(taskId)} to={getTaskRoute(taskId)}>
    <WordBreak>{taskName}</WordBreak>
  </StyledRouterLink>
);
