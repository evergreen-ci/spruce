import styled from "@emotion/styled";
import { uiColors } from "@leafygreen-ui/palette";
import { Body } from "@leafygreen-ui/typography";
import { GroupedTaskStatusBadge } from "components/GroupedTaskStatusBadge";
import {
  groupStatusesByUmbrellaStatus,
  isFailedTaskStatus,
} from "utils/statuses";
import { FailedTaskStatusIcon } from "./buildVariantCard/FailedTaskStatusIcon";

const { gray } = uiColors;

type taskList = {
  id: string;
  status: string;
  displayName: string;
  timeTaken?: number;
}[];
interface Props {
  variant: string;
  buildVariantDisplayName: string;
  tasks?: taskList;
  shouldGroupTasks: boolean;
  versionId: string;
}
export const BuildVariantCard: React.FC<Props> = ({
  buildVariantDisplayName,
  variant,
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
            variant={variant}
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
      <Label>{buildVariantDisplayName}</Label>
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
  variant: string;
}
const RenderGroupedIcons: React.FC<RenderGroupedIconsProps> = ({
  tasks,
  versionId,
  variant,
}) => {
  // get the count of the amount of tasks in each status
  const { stats } = groupStatusesByUmbrellaStatus(
    tasks.map(({ status }) => ({ status, count: 1 }))
  );
  return (
    <>
      {stats.map(({ count, umbrellaStatus, statusCounts }) => (
        <GroupedTaskStatusBadgeWrapper
          key={umbrellaStatus}
          data-cy="grouped-task-status-badge"
        >
          <GroupedTaskStatusBadge
            status={umbrellaStatus}
            count={count}
            statusCounts={statusCounts}
            versionId={versionId}
            variant={variant}
          />
        </GroupedTaskStatusBadgeWrapper>
      ))}
    </>
  );
};

interface RenderTaskIconsProps {
  tasks: taskList;
}

const RenderTaskIcons: React.FC<RenderTaskIconsProps> = ({ tasks }) => (
  <>
    {tasks.map(({ id, status, displayName, timeTaken }) => (
      <FailedTaskStatusIcon
        key={id}
        taskId={id}
        status={status}
        displayName={displayName}
        timeTaken={timeTaken}
      />
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
