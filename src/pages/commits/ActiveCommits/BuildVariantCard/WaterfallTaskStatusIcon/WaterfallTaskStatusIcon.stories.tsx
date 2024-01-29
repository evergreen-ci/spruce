import styled from "@emotion/styled";
import { CustomStoryObj, CustomMeta } from "test_utils/types";
import { TaskStatus } from "types/task";
import { WaterfallTaskStatusIcon } from ".";
import { getTooltipQueryMock } from "./testData";

export default {
  title: "Pages/Commits/WaterfallIcon",
  component: WaterfallTaskStatusIcon,
  parameters: {
    apolloClient: {
      mocks: [getTooltipQueryMock],
    },
  },
} satisfies CustomMeta<typeof WaterfallTaskStatusIcon>;

export const Default: CustomStoryObj<typeof WaterfallTaskStatusIcon> = {
  render: (args) => (
    <Container>
      <WaterfallTaskStatusIcon {...args} />
    </Container>
  ),
  args: {
    displayName: "multiversion",
    timeTaken: 2754729,
    taskId: "task-id",
    identifier: "ubuntu1604",
    status: "failed",
    hasCedarResults: true,
  },
  argTypes: {
    status: {
      options: TaskStatus,
      control: { type: "select" },
    },
  },
};

const Container = styled.div`
  width: fit-content;
  display: flex;
  justify-content: center;
  margin-right: auto;
  margin-left: auto;
`;
