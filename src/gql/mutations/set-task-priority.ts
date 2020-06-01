import gql from "graphql-tag";

export const SET_TASK_PRIORTY = gql`
  mutation SetTaskPriority($taskId: String!, $priority: Int!) {
    setTaskPriority(taskId: $taskId, priority: $priority) {
      id
      priority
    }
  }
`;
