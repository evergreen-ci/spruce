import { gql } from "@apollo/client";

export const ABORT_TASK = gql`
  mutation AbortTask($taskId: String!) {
    abortTask(taskId: $taskId) {
      id
    }
  }
`;
