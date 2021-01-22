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

export const GET_ANNOTATION_EVENT_DATA = gql`
  query GetAnnotationEventData($taskId: String!, $execution: Int) {
    task(taskId: $taskId, execution: $execution) {
      annotation {
        id
        taskId
        taskExecution
        note {
          source {
            author
            time
            requester
          }
          message
        }
        issues {
          issueKey
          url
          source {
            author
            time
            requester
          }
        }
        suspectedIssues {
          issueKey
          url
          source {
            author
            time
            requester
          }
        }
      }
    }
  }
`;
