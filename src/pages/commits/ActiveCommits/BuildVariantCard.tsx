import styled from "@emotion/styled";
import IconButton from "@leafygreen-ui/icon-button";
import { uiColors } from "@leafygreen-ui/palette";
import { Body } from "@leafygreen-ui/typography";
import { Link } from "react-router-dom";
import { GroupedTaskStatusBadge } from "components/GroupedTaskStatusBadge";
import { TaskStatusIcon } from "components/TaskStatusIcon";
import { getVersionRoute, getTaskRoute } from "constants/routes";
import { mapUmbrellaStatusToQueryParam } from "constants/task";
import { groupStatusesByColor, isFailedTaskStatus } from "utils/statuses";
import { applyStrictRegex } from "utils/string";

const { gray } = uiColors;

interface Props {
  buildVariantId: string;
  buildVariantDisplayName: string;
  tasks?: {
    id: string;
    status: string;
  }[];
  shouldGroupTasks: boolean;
  versionId: string;
}
export const BuildVariantCard: React.FC<Props> = ({
  buildVariantDisplayName,
  buildVariantId,
  tasks,
  shouldGroupTasks,
  versionId,
}) => {
  let render = null;
  if (shouldGroupTasks) {
    const nonFailingTasks = tasks.filter(
      (task) => !isFailedTaskStatus(task.status)
    );
    const failingTasks = tasks.filter((task) =>
      isFailedTaskStatus(task.status)
    );
    render = (
      <>
        <IconContainer>
          <RenderGroupedIcons
            tasks={nonFailingTasks}
            versionId={versionId}
            buildVariantId={buildVariantId}
          />
        </IconContainer>
        <IconContainer>
          <RenderTaskIcons tasks={failingTasks} />
        </IconContainer>
      </>
    );
  } else {
    render = (
      <>
        <IconContainer>
          <RenderTaskIcons tasks={tasks} />
        </IconContainer>
      </>
    );
  }
  return (
    <Container>
      <Label key={buildVariantId}>{buildVariantDisplayName}</Label>
      {render}
    </Container>
  );
};

interface RenderGroupedIconsProps {
  tasks: {
    id: string;
    status: string;
  }[];
  versionId: string;
  buildVariantId: string;
}
const RenderGroupedIcons: React.FC<RenderGroupedIconsProps> = ({
  tasks,
  versionId,
  buildVariantId,
}) => {
  // get the count of the amount of tasks in each status
  const { stats } = groupStatusesByColor(
    tasks.map((task) => ({ ...task, count: 1 }))
  );
  // get all the umbrellaStatus that are not Failed
  const otherTasks = stats.filter(
    (stat) => !isFailedTaskStatus(stat.umbrellaStatus)
  );
  return (
    <>
      {otherTasks.map(({ count, umbrellaStatus }) => (
        <GroupedTaskStatusBadgeWrapper data-cy="grouped-task-status-badge">
          <Link
            to={getVersionRoute(versionId, {
              statuses: mapUmbrellaStatusToQueryParam[umbrellaStatus],
              variant: applyStrictRegex(buildVariantId),
            })}
          >
            <GroupedTaskStatusBadge
              status={umbrellaStatus}
              key={`${umbrellaStatus}_${versionId}_${buildVariantId}_groupedBadge`}
              count={count}
            />
          </Link>
        </GroupedTaskStatusBadgeWrapper>
      ))}
    </>
  );
};

interface RenderTaskIconsProps {
  tasks: {
    id: string;
    status: string;
  }[];
}

const RenderTaskIcons: React.FC<RenderTaskIconsProps> = ({ tasks }) => (
  <>
    {tasks.map(({ id, status }) => (
      <Link data-cy="task-status-icon" to={getTaskRoute(id)} key={`task_${id}`}>
        <IconButton aria-label="task icon">
          <TaskStatusIcon status={status} size={16} />
        </IconButton>
      </Link>
    ))}
  </>
);
const Label = styled(Body)`
  color: ${gray.dark2};
  font-size: 14px;
  word-break: break-word;
  margin-bottom: 24px;
`;

const IconContainer = styled.div`
  display: flex;
  flex-direction: row;
  margin-bottom: 16px;
  flex-wrap: wrap;
`;

const Container = styled.div`
  width: 160px;
`;

const GroupedTaskStatusBadgeWrapper = styled.div`
  margin-right: 4px;
`;
