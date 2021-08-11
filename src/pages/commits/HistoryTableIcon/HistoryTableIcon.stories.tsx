import styled from "@emotion/styled";
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
  { status: TaskStatus.Succeeded, label: "5000/5000 failing tests" },
  { status: TaskStatus.Failed, label: "5/10 failing tests" },
  { status: TaskStatus.KnownIssue, label: "1/2 failing tests" },
  { status: TaskStatus.Dispatched, label: "1/2 failing tests" },
  { status: TaskStatus.SetupFailed, label: "5/10 failing tests" },
  { status: TaskStatus.SystemUnresponsive, label: "5/10 failing tests" },
  { status: TaskStatus.TestTimedOut, label: "5/10 failing tests" },
  { status: TaskStatus.Aborted, label: "5/10 failing tests" },
  { status: TaskStatus.WillRun, label: "5/10 failing tests" },
  { status: TaskStatus.Inactive, label: "5/10 failing tests" },
];
export const ActiveIcons = () => (
  <Container>
    {data.map(({ status, label }, key) => (
      <HistoryTableIcon
        {...{ key, status, label, failingTests, inactive: false }}
      />
    ))}
  </Container>
);

export const InactiveIcons = () => (
  <Container>
    {data.map(({ status, label }, key) => (
      <HistoryTableIcon
        {...{ key, status, label, failingTests, inactive: true }}
      />
    ))}
  </Container>
);

const Container = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
`;
