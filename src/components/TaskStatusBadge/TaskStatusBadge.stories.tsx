import styled from "@emotion/styled";
import { TaskStatus } from "types/task";
import TaskStatusBadge from "./index";

export default {
  title: "Task Status Badges",
};

export const badges = () => {
  const taskStatuses = Object.keys(TaskStatus);
  console.log(taskStatuses);
  return (
    <Container>
      {taskStatuses.map((status) => (
        <Wrapper>
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
