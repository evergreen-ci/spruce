import styled from "@emotion/styled";
import { action } from "@storybook/addon-actions";
import { CustomStoryObj, CustomMeta } from "test_utils/types";
import { TaskStatus } from "types/task";
import { HistoryTableIcon } from "./index";

export default {
  title: "Components/HistoryTable/Icons",
  component: HistoryTableIcon,
} satisfies CustomMeta<typeof HistoryTableIcon>;

export const ActiveIcons: CustomStoryObj<typeof HistoryTableIcon> = {
  render: () => (
    <Container>
      {data.map(({ label, status }) => (
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
  ),
};

export const InactiveIcons: CustomStoryObj<typeof HistoryTableIcon> = {
  render: () => (
    <Container>
      {data.map(({ status }) => (
        <HistoryTableIcon
          key={`${status}_history_table_inactive`}
          status={status}
          inactive
        />
      ))}
    </Container>
  ),
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
const Container = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
`;
