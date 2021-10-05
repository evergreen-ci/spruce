import styled from "@emotion/styled";
import { action } from "@storybook/addon-actions";
import { TaskStatus } from "types/task";
import { GroupedTaskStatusBadge } from ".";

export default {
  title: "Grouped Task Status Badge",
};

export const GroupedTaskStatusBadges = () => (
  <Container>
    {groupedTaskStats.map((item) => (
      <GroupedTaskStatusBadge
        status={item.status}
        count={item.count}
        key={item.status}
        onClick={action(`Click status ${item.status}`)}
      />
    ))}
  </Container>
);

const groupedTaskStats = [
  { status: TaskStatus.Succeeded, count: 20 },
  { status: TaskStatus.Succeeded, count: 1 },
  { status: TaskStatus.FailedUmbrella, count: 1 },
  { status: TaskStatus.RunningUmbrella, count: 2 },
  { status: TaskStatus.SystemFailureUmbrella, count: 3 },
  { status: TaskStatus.SetupFailed, count: 4 },
  { status: TaskStatus.SetupFailed, count: 1 },
  { status: TaskStatus.UndispatchedUmbrella, count: 5 },
  { status: TaskStatus.ScheduledUmbrella, count: 5 },
];

const Container = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-around;
`;
