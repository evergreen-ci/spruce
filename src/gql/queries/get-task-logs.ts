import gql from "graphql-tag";

export const GET_EVENT_LOGS = gql`
  query EventLogs($id: String!) {
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
  query TaskLogs($id: String!) {
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
  query AgentLogs($id: String!) {
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
  query SystemLogs($id: String!) {
    taskLogs(taskId: $id) {
      systemLogs {
        severity
        message
        timestamp
      }
    }
  }
`;
