import { gql } from "@apollo/client";

/* eslint-disable */
export const GET_TASK_EVENT_DATA = gql`
  query GetTaskEventData($taskId: String!) {
    task(taskId: $taskId) {
      status
      failedTestCount
    }
  }
`;
