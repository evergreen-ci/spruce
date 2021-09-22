import styled from "@emotion/styled";
import IconButton from "@leafygreen-ui/icon-button";
import { uiColors } from "@leafygreen-ui/palette";
import { Body } from "@leafygreen-ui/typography";
import escapeRegExp from "lodash.escaperegexp";
import { GroupedTaskStatusBadge } from "components/GroupedTaskStatusBadge";
import { StyledRouterLink } from "components/styles";
import { TaskStatusIcon } from "components/TaskStatusIcon";
import { getVersionRoute, getTaskRoute } from "constants/routes";
import { mapUmbrellaStatusToQueryParam } from "constants/task";
import { groupStatusesByColor, isFailedTaskStatus } from "utils/statuses";

const { gray } = uiColors;

interface Props {
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
            buildVariantDisplayName={buildVariantDisplayName}
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
      <Label key={buildVariantDisplayName}>{buildVariantDisplayName}</Label>
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
  buildVariantDisplayName: string;
}
const RenderGroupedIcons: React.FC<RenderGroupedIconsProps> = ({
  tasks,
  versionId,
  buildVariantDisplayName,
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
      {otherTasks.map(({ count, umbrellaStatus }) => {
        const onClick = () =>
          push(
            getVersionRoute(versionId, {
              statuses: mapUmbrellaStatusToQueryParam[umbrellaStatus],
              variant: escapeRegExp(buildVariantDisplayName),
            })
          );
        return (
          <GroupedTaskStatusBadgeWrapper>
            <GroupedTaskStatusBadge
              status={umbrellaStatus}
              key={`${umbrellaStatus}_groupedBadge`}
              count={count}
              onClick={onClick}
            />
          </GroupedTaskStatusBadgeWrapper>
        );
      })}
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
      <StyledRouterLink to={getTaskRoute(id)}>
        <IconButton key={`task_${id}`} aria-label="task icon">
          <TaskStatusIcon status={status} size={16} />
        </IconButton>
      </StyledRouterLink>
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
