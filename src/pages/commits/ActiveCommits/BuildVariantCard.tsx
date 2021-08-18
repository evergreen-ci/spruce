import styled from "@emotion/styled";
import IconButton from "@leafygreen-ui/icon-button";
import { uiColors } from "@leafygreen-ui/palette";
import { Body } from "@leafygreen-ui/typography";
import { GroupedTaskStatusBadge } from "components/GroupedTaskStatusBadge";
import { TaskStatusIcon } from "components/TaskStatusIcon";
import { groupStatusesByColor, isFailedTaskStatus } from "utils/statuses";

const { gray } = uiColors;

interface Props {
  buildVariantDisplayName: string;
  tasks?: {
    id: string;
    status: string;
  }[];
  shouldGroupTasks: boolean;
}
export const BuildVariantCard: React.FC<Props> = ({
  buildVariantDisplayName,
  tasks,
  shouldGroupTasks,
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
          <RenderGroupedIcons tasks={nonFailingTasks} />
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

const RenderGroupedIcons = ({ tasks }) => {
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
        <GroupedTaskStatusBadgeWrapper>
          <GroupedTaskStatusBadge
            status={umbrellaStatus}
            key={`${umbrellaStatus}_groupedBadge`}
            count={count}
          />
        </GroupedTaskStatusBadgeWrapper>
      ))}
    </>
  );
};

const RenderTaskIcons = ({ tasks }) => (
  <>
    {tasks.map(({ id, status }) => (
      <IconButton
        aria-label="task icon"
        onClick={() => {
          console.log({ id, status });
        }}
      >
        <TaskStatusIcon status={status} size={16} />
      </IconButton>
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
