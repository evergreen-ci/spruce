import styled from "@emotion/styled";
import { Size } from "components/Icon";
import { size } from "constants/tokens";
import { CustomStoryObj, CustomMeta } from "test_utils/types";
import { TaskStatus } from "types/task";
import { TaskStatusIcon, TaskStatusIconProps } from ".";

const Sizes = {
  [Size.Small]: 14,
  [Size.Default]: 16,
  [Size.Large]: 20,
  [Size.XLarge]: 24,
};

export default {
  component: TaskStatusIcon,
  title: "Components/Icon/Task Status",
} satisfies CustomMeta<typeof TaskStatusIcon>;

export const Default: CustomStoryObj<TaskStatusIconProps> = {
  argTypes: {
    size: {
      control: { type: "select" },
      options: Object.values(Sizes),
    },
  },
  args: {
    color: "#000000",
    size: Sizes[Size.Default],
  },
  render: ({ size: s }) => {
    // filter out umbrella statuses
    const taskStatuses = Object.keys(TaskStatus).filter(
      (taskName) => !taskName.includes("Umbrella")
    );
    return (
      <Container>
        {taskStatuses.map((status) => (
          <IconContainer key={status}>
            <TaskStatusIcon status={TaskStatus[status]} size={s} />
            <span>{status}</span>
          </IconContainer>
        ))}
      </Container>
    );
  },
};

const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
`;
const IconContainer = styled.div`
  width: 150px;
  height: 70px;
  flex-shrink: 0;
  text-align: center;
  border: 1px solid #babdbe;
  border-radius: ${size.xxs};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  margin: 0.5rem;
`;
