import gql from "graphql-tag";

export const RESTART_TASK = gql`
  mutation RestartTask($taskId: String!) {
    restartTask(taskId: $taskId) {
      id
    }
  }
`;
