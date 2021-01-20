import { gql } from "@apollo/client";

export const GET_TASK_EVENT_DATA = gql`
  query GetTaskEventData($taskId: String!) {
    task(taskId: $taskId) {
      id
      execution
      status
      failedTestCount
    }
  }
`;
