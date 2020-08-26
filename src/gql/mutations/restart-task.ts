import { gql } from "@apollo/client";

export const RESTART_TASK = gql`
  mutation RestartTask($taskId: String!) {
    restartTask(taskId: $taskId) {
      id
    }
  }
`;
