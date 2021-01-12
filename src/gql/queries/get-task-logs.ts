import { gql } from "@apollo/client";

export const GET_EVENT_LOGS = gql`
  query EventLogs($id: String!, $execution: Int!) {
    taskLogs(taskId: $id, execution: $execution) {
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
  query TaskLogs($id: String!, $execution: Int!) {
    taskLogs(taskId: $id, execution: $execution) {
      taskLogs {
        severity
        message
        timestamp
      }
    }
  }
`;

export const GET_AGENT_LOGS = gql`
  query AgentLogs($id: String!, $execution: Int!) {
    taskLogs(taskId: $id, execution: $execution) {
      agentLogs {
        severity
        message
        timestamp
      }
    }
  }
`;

export const GET_SYSTEM_LOGS = gql`
  query SystemLogs($id: String!, $execution: Int!) {
    taskLogs(taskId: $id, execution: $execution) {
      systemLogs {
        severity
        message
        timestamp
      }
    }
  }
`;
