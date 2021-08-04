import styled from "@emotion/styled";
import { TaskStatus } from "types/task";
import { HistoryTableIcon } from "./index";

export default {
  title: "History Table Icon",
  component: HistoryTableIcon,
};

const failingTests = [
  "test a",
  "test b",
  "test c",
  "test looooonnnnnnnng name",
  "some other test",
  "test name d",
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
    {data.map(({ status, label }) => (
      <HistoryTableIcon {...{ status, label, failingTests, inactive: false }} />
    ))}
  </Container>
);

export const InactiveIcons = () => (
  <Container>
    {data.map(({ status, label }) => (
      <HistoryTableIcon {...{ status, label, failingTests, inactive: true }} />
    ))}
  </Container>
);

const Container = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
`;
