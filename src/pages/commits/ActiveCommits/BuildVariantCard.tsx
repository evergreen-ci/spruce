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
}
export const BuildVariantCard: React.FC<Props> = ({
  buildVariantDisplayName,
  tasks,
}) => {
  // get the count of the amount of tasks in each status
  const { stats } = groupStatusesByColor(
    tasks.map((task) => ({ ...task, count: 1 }))
  );
  const failingTasks = tasks.filter((task) => isFailedTaskStatus(task.status));
  // get all the umbrellaStatus that are not Failed
  const otherTasks = stats.filter(
    (stat) => !isFailedTaskStatus(stat.umbrellaStatus)
  );
  return (
    <>
      <Label key={buildVariantDisplayName}>{buildVariantDisplayName}</Label>
      <IconContainer>
        {otherTasks.map(({ count, umbrellaStatus }) => (
          <GroupedTaskStatusBadgeWrapper>
            <GroupedTaskStatusBadge
              status={umbrellaStatus}
              key={`${umbrellaStatus}_groupedBadge`}
              count={count}
            />
          </GroupedTaskStatusBadgeWrapper>
        ))}
      </IconContainer>
      <IconContainer>
        {failingTasks.map(({ id, status }) => (
          <IconButton
            aria-label="Failing task icon"
            onClick={() => {
              console.log({ id, status });
            }}
          >
            <TaskStatusIcon status={status} size={16} />
          </IconButton>
        ))}
      </IconContainer>
    </>
  );
};

const Label = styled(Body)`
  color: ${gray.dark2};
  font-size: 14px;
  width: 124px;
  word-break: break-word;
  margin-bottom: 24px;
`;

const IconContainer = styled.div`
  display: flex;
  flex-direction: row;
  margin-bottom: 16px;
`;

const GroupedTaskStatusBadgeWrapper = styled.div`
  margin-right: 4px;
`;
