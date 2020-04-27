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
  kind?: "taskEventLogEntry";
  timestamp: string;
  eventType: string;
  data: TaskEventLogData;
}

export interface LogMessage {
  kind?: "logMessage";
  severity: string;
  message: string;
  timestamp: string;
}

interface EventLogsQueryData {
  eventLogs: [TaskEventLogEntry];
}

interface TaskLogsQueryData {
  taskLogs: [LogMessage];
}

interface AgentLogsQueryData {
  agentLogs: [LogMessage];
}

interface SystemLogsQueryData {
  systemLogs: [LogMessage];
}

export interface EventLogsQuery {
  taskLogs: EventLogsQueryData;
}

export interface TaskLogsQuery {
  taskLogs: TaskLogsQueryData;
}

export interface AgentLogsQuery {
  taskLogs: AgentLogsQueryData;
}

export interface SystemLogsQuery {
  taskLogs: SystemLogsQueryData;
}
