import React from "react";
import {
  GET_AGENT_LOGS,
  GET_EVENT_LOGS,
  GET_SYSTEM_LOGS,
  GET_TASK_LOGS,
} from "gql/queries/get-task-logs";
import {
  EventLogsQuery,
  EventLogsQueryVariables,
  SystemLogsQuery,
  SystemLogsQueryVariables,
  AgentLogsQuery,
  AgentLogsQueryVariables,
  TaskLogsQuery,
  TaskLogsQueryVariables,
  LogMessage,
  TaskEventLogEntry,
} from "gql/generated/types";
import { useQuery } from "@apollo/react-hooks";
import { TaskEventLogLine } from "./logTypes/TaskEventLogLine";
import { LogMessageLine } from "./logTypes/LogMessageLine";
import { ApolloError } from "apollo-client";
import { useParams } from "react-router-dom";
import get from "lodash/get";

interface TaskEventLogEntryType extends TaskEventLogEntry {
  kind?: "taskEventLogEntry";
}
interface LogMessageType extends LogMessage {
  kind?: "logMessage";
}
export const EventLog = () => {
  const { id } = useParams<{ id: string }>();
  const { data, loading, error } = useQuery<
    EventLogsQuery,
    EventLogsQueryVariables
  >(GET_EVENT_LOGS, {
    variables: { id },
  });
  return useRenderBody({
    data: get(data, "taskLogs.eventLogs", []).map((v: TaskEventLogEntry) => ({
      ...v,
      kind: "taskEventLogEntry",
    })),
    loading,
    error,
  });
};

export const SystemLog = () => {
  const { id } = useParams<{ id: string }>();
  const { data, loading, error } = useQuery<
    SystemLogsQuery,
    SystemLogsQueryVariables
  >(GET_SYSTEM_LOGS, {
    variables: { id },
  });
  return useRenderBody({
    data: get(data, "taskLogs.systemLogs", []),
    loading,
    error,
  });
};

export const AgentLog = () => {
  const { id } = useParams<{ id: string }>();
  const { data, loading, error } = useQuery<
    AgentLogsQuery,
    AgentLogsQueryVariables
  >(GET_AGENT_LOGS, {
    variables: { id },
  });
  return useRenderBody({
    data: get(data, "taskLogs.agentLogs", []),
    loading,
    error,
  });
};

export const TaskLog = () => {
  const { id } = useParams<{ id: string }>();
  const { data, loading, error } = useQuery<
    TaskLogsQuery,
    TaskLogsQueryVariables
  >(GET_TASK_LOGS, {
    variables: { id },
  });
  return useRenderBody({
    data: get(data, "taskLogs.taskLogs", []),
    loading,
    error,
  });
};

const useRenderBody = ({
  loading,
  error,
  data,
}: {
  loading: boolean;
  error: ApolloError;
  data: [TaskEventLogEntryType | LogMessageType];
}) => {
  const noLogs = <div id="cy-no-logs">No logs</div>;

  if (loading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>{error.message}</div>;
  }
  if (!data.length) {
    return noLogs;
  }

  return (
    <>
      {data.map((d, i) =>
        d.kind === "taskEventLogEntry" ? (
          <TaskEventLogLine key={i} {...d} />
        ) : (
          <LogMessageLine key={i} {...d} />
        )
      )}
    </>
  );
};
