import gql from "graphql-tag";

export const GET_TASK_LOGS = gql`
  query taskLogs($id: String!) {
    taskLogs(taskId: $id) {
      taskLogs {
        type
        severity
        message
        timestamp
        version
      }
      agentLogs {
        type
        severity
        message
        timestamp
        version
      }
      systemLogs {
        type
        severity
        message
        timestamp
        version
      }
      eventLogs {
        timestamp
        eventType
        data {
          hostId
          jiraIssue
          priority
          status
          timestamp
          userId
        }
      }
    }
  }
`;

export interface TaskEventLogData {
  type: string;
  severity: string;
  message: string;
  timestamp: string;
  version: string;
}

export interface LogMessage {
  type: string;
  severity: string;
  message: string;
  timestamp: string;
  version: string;
}

interface TaskLogsQueryData {
  agentLogs: [LogMessage];
  eventLogs: [TaskEventLogData];
  systemLogs: [LogMessage];
  taskLogs: [LogMessage];
}
export interface TaskLogsQuery {
  taskLogs: TaskLogsQueryData;
}
