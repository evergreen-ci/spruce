import styled from "@emotion/styled";
import { TaskStatus } from "types/task";
import TaskStatusBadge from "./index";

export default {
  title: "Task Status Badges",
};

export const badges = () => {
  const taskStatuses = Object.keys(TaskStatus);
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
  width: 80%;
`;
const Wrapper = styled.div`
  padding: 5px;
`;
