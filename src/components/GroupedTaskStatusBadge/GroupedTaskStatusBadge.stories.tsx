import styled from "@emotion/styled";
import { action } from "@storybook/addon-actions";
import { MemoryRouter } from "react-router-dom";
import { TaskStatus } from "types/task";
import { GroupedTaskStatusBadge } from ".";

export default {
  title: "Grouped Task Status Badge",
  decorators: [
    (Story) => (
      <MemoryRouter>
        <Story />
      </MemoryRouter>
    ),
  ],
};

export const GroupedTaskStatusBadges = () => (
  <Container>
    {groupedTaskStats.map((item) => (
      <GroupedTaskStatusBadge
        versionId="some_version"
        status={item.status}
        count={item.count}
        key={item.status}
        onClick={action(`Click status ${item.status}`)}
        statusCounts={statusCounts}
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

const statusCounts = {
  started: 30,
  failed: 15,
  unstarted: 5,
  unscheduled: 6,
  "will-run": 11,
  dispatched: 99,
  pending: 987,
  "test-timed-out": 2,
  "task-timed-out": 53,
  "system-failed": 22,
  blocked: 50,
  aborted: 88,
};
