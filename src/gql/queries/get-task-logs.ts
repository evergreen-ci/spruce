import gql from "graphql-tag";

export const GET_TASK_LOGS = gql`
  query taskLogs($id: String!) {
    taskLogs(taskId: $id) {
      taskLogs {
        severity
        message
        timestamp
      }
      agentLogs {
        severity
        message
        timestamp
      }
      systemLogs {
        severity
        message
        timestamp
      }
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
interface TaskEventLogData {
  hostId: string;
  jiraIssue: string;
  jiraLink: string;
  priority: string;
  status: string;
  timestamp: string;
  userId: string;
}
export interface TaskEventLogEntry {
  timestamp: string;
  eventType: string;
  data: TaskEventLogData;
}
export interface LogMessage {
  severity: string;
  message: string;
  timestamp: string;
}
interface TaskLogsQueryData {
  agentLogs: [LogMessage];
  eventLogs: [TaskEventLogEntry];
  systemLogs: [LogMessage];
  taskLogs: [LogMessage];
}
export interface TaskLogsQuery {
  taskLogs: TaskLogsQueryData;
}
