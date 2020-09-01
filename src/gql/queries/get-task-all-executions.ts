import { gql } from "@apollo/client";

export const GET_TASK_ALL_EXECUTIONS = gql`
  query GetTaskAllExecutions($taskId: String!) {
    taskAllExecutions(taskId: $taskId) {
      execution
      status
      ingestTime
    }
  }
`;
