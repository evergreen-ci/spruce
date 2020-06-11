import gql from "graphql-tag";

/* eslint-disable */
export const GET_TASK_EVENT_DATA = gql`
  query GetTaskEventData($taskId: String!) {
    task(taskId: $taskId) {
      id @client
      status @client
      failedTestCount @client
    }
  }
`;
