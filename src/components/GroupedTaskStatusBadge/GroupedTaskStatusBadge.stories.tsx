import styled from "@emotion/styled";
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
      />
    ))}
  </Container>
);

const groupedTaskStats = [
  { status: TaskStatus.Succeeded, count: 20 },
  { status: TaskStatus.Succeeded, count: 1 },
  { status: TaskStatus.Failed, count: 1 },
  { status: TaskStatus.Started, count: 2 },
  { status: TaskStatus.SystemFailed, count: 3 },
  { status: TaskStatus.SetupFailed, count: 4 },
  { status: TaskStatus.SetupFailed, count: 1 },
  { status: TaskStatus.Undispatched, count: 5 },
  { status: TaskStatus.WillRun, count: 5 },
];

const Container = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-around;
`;
