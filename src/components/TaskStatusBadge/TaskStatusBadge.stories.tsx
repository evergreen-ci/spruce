import styled from "@emotion/styled";
import { TaskStatus } from "types/task";
import TaskStatusBadge from "./index";

export default {
  title: "Task Status Badges",
  component: TaskStatusBadge,
};

export const Default = () => {
  // filter out umbrella statuses
  const taskStatuses = Object.keys(TaskStatus).filter(
    (taskName) => !taskName.includes("Umbrella")
  );
  return (
    <Container>
      {taskStatuses.map((status) => (
        <Wrapper key={`badge_${status}`}>
          <TaskStatusBadge status={TaskStatus[status]} />
        </Wrapper>
      ))}
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
`;
const Wrapper = styled.div`
  padding: 5px;
`;
