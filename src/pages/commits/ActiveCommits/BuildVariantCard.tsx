import styled from "@emotion/styled";
import { GroupedTaskStatusBadge } from "components/GroupedTaskStatusBadge";
import { StyledRouterLink } from "components/styles";
import { getVariantHistoryRoute } from "constants/routes";

import {
  groupStatusesByUmbrellaStatus,
  isFailedTaskStatus,
} from "utils/statuses";
import { WaterfallTaskStatusIcon } from "./buildVariantCard/WaterfallTaskStatusIcon";

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
  projectIdentifier: string;
}
export const BuildVariantCard: React.FC<Props> = ({
  buildVariantDisplayName,
  variant,
  tasks,
  shouldGroupTasks,
  versionId,
  projectIdentifier,
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
      <Label to={getVariantHistoryRoute(projectIdentifier, variant)}>
        {buildVariantDisplayName}
      </Label>
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
      <WaterfallTaskStatusIcon
        key={id}
        taskId={id}
        status={status}
        displayName={displayName}
        timeTaken={timeTaken}
      />
    ))}
  </>
);
const Label = styled(StyledRouterLink)`
  word-break: break-word;
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
