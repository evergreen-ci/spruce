import gql from "graphql-tag";

export const GET_EVENT_LOGS = gql`
  query eventLogs($id: String!) {
    taskLogs(taskId: $id) {
      eventLogs {
        timestamp
        eventType
        data {
          hostId
          jiraIssue
          jiraLink
          priority
          status
          timestamp
          userId
        }
      }
    }
  }
`;

export const GET_TASK_LOGS = gql`
  query taskLogs($id: String!) {
    taskLogs(taskId: $id) {
      taskLogs {
        severity
        message
        timestamp
      }
    }
  }
`;

export const GET_AGENT_LOGS = gql`
  query agentLogs($id: String!) {
    taskLogs(taskId: $id) {
      agentLogs {
        severity
        message
        timestamp
      }
    }
  }
`;

export const GET_SYSTEM_LOGS = gql`
  query systemLogs($id: String!) {
    taskLogs(taskId: $id) {
      systemLogs {
        severity
        message
        timestamp
      }
    }
  }
`;
