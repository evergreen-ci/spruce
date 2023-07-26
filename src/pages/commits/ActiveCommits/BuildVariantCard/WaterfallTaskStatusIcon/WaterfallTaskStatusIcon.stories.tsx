import styled from "@emotion/styled";
import { CustomStoryObj, CustomMeta } from "test_utils/types";
import { TaskStatus } from "types/task";
import { WaterfallTaskStatusIcon } from ".";
import { getTooltipQueryMock } from "./testData";

export default {
  component: WaterfallTaskStatusIcon,
  parameters: {
    apolloClient: {
      mocks: [getTooltipQueryMock],
    },
  },
  title: "Pages/Commits/WaterfallIcon",
} satisfies CustomMeta<typeof WaterfallTaskStatusIcon>;

export const Default: CustomStoryObj<typeof WaterfallTaskStatusIcon> = {
  argTypes: {
    status: {
      control: { type: "select" },
      options: TaskStatus,
    },
  },
  args: {
    displayName: "multiversion",
    failedTestCount: 5,
    identifier: "ubuntu1604",
    status: "failed",
    taskId: "task-id",
    timeTaken: 2754729,
  },
  render: (args) => (
    <Container>
      <WaterfallTaskStatusIcon {...args} />
    </Container>
  ),
};

const Container = styled.div`
  width: fit-content;
  display: flex;
  justify-content: center;
  margin-right: auto;
  margin-left: auto;
`;
