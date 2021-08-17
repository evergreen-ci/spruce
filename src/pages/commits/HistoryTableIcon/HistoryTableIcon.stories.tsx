import styled from "@emotion/styled";
import { action } from "@storybook/addon-actions";
import { TaskStatus } from "types/task";
import { HistoryTableIcon } from "./index";

export default {
  title: "History Table Icon",
  component: HistoryTableIcon,
};

const failingTests = [
  { testName: "test a", testId: "1" },
  { testName: "test b", testId: "2" },
  { testName: "test c", testId: "3" },
  { testName: "test looooonnnnnnnng name", testId: "4" },
  { testName: "some other test", testId: "5" },
  { testName: "test name d", testId: "6" },
];

const data = [
  { status: TaskStatus.Succeeded },
  { status: TaskStatus.Failed, label: "5/10 failing tests" },
  { status: TaskStatus.KnownIssue, label: "1/2 failing tests" },
  { status: TaskStatus.Dispatched },
  { status: TaskStatus.SetupFailed, label: "5/10 failing tests" },
  { status: TaskStatus.SystemUnresponsive, label: "5/10 failing tests" },
  { status: TaskStatus.TestTimedOut, label: "5/10 failing tests" },
  { status: TaskStatus.Aborted, label: "5/10 failing tests" },
  { status: TaskStatus.WillRun },
  { status: TaskStatus.Inactive },
];
export const ActiveIcons = () => (
  <Container>
    {data.map(({ status, label }) => (
      <HistoryTableIcon
        key={`${status}_history_table`}
        status={status}
        label={label}
        failingTests={label ? failingTests : undefined}
        inactive={false}
        onClick={action(`clicked ${status}`)}
      />
    ))}
  </Container>
);

export const InactiveIcons = () => (
  <Container>
    {data.map(({ status }) => (
      <HistoryTableIcon
        key={`${status}_history_table_inactive`}
        status={status}
        inactive
      />
    ))}
  </Container>
);

const Container = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
`;
