import styled from "@emotion/styled";
import { Size } from "components/Icon";
import { size } from "constants/tokens";
import { TaskStatus } from "types/task";
import { TaskStatusIcon } from ".";

const Sizes = {
  [Size.Small]: 14,
  [Size.Default]: 16,
  [Size.Large]: 20,
  [Size.XLarge]: 24,
};

export default {
  title: "Task Status Icons",
  component: TaskStatusIcon,
  args: {
    color: "#000000",
    size: Sizes[Size.Default],
  },
  argTypes: {
    size: {
      control: { type: "select", options: Sizes },
    },
  },
};

export const AllStatuses = ({ size: s }) => {
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
