import gql from "graphql-tag";

/* eslint-disable */
export const GET_TASK_EVENT_DATA = gql`
  query GetTaskEventData($id: String!) {
    task(taskId: $id) {
      status @client
      failedTestCount @client
    }
  }
`;
