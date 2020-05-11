import gql from "graphql-tag";

export const ABORT_TASK = gql`
  mutation AbortTask($taskId: String!) {
    abortTask(taskId: $taskId) {
      id
    }
  }
`;
