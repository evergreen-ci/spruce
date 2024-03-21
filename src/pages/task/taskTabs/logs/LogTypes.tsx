import { useEffect } from "react";
import { useQuery, ApolloError } from "@apollo/client";
import styled from "@emotion/styled";
import { palette } from "@leafygreen-ui/palette";
import { Skeleton } from "antd";
import { useParams, useLocation } from "react-router-dom";
import { DEFAULT_POLL_INTERVAL } from "constants/index";
import { slugs } from "constants/routes";
import { size, fontSize } from "constants/tokens";
import {
  TaskEventLogsQuery,
  TaskEventLogsQueryVariables,
  SystemLogsQuery,
  SystemLogsQueryVariables,
  AgentLogsQuery,
  AgentLogsQueryVariables,
  TaskLogsQuery,
  TaskLogsQueryVariables,
  AllLogsQuery,
  AllLogsQueryVariables,
  TaskEventLogEntry,
  LogMessageFragment,
} from "gql/generated/types";
import {
  AGENT_LOGS,
  TASK_EVENT_LOGS,
  SYSTEM_LOGS,
  TASK_LOGS,
  ALL_LOGS,
} from "gql/queries";
import { usePolling } from "hooks";
import { RequiredQueryParams } from "types/task";
import { queryString } from "utils";
import { LogMessageLine } from "./logTypes/LogMessageLine";
import { TaskEventLogLine } from "./logTypes/TaskEventLogLine";

const { parseQueryString } = queryString;

const { gray } = palette;

interface TaskEventLogEntryType extends TaskEventLogEntry {
  kind?: "taskEventLogEntry";
}
interface LogMessageType extends LogMessageFragment {
  kind?: "logMessage";
}
interface Props {
  setNoLogs: (noLogs: boolean) => void;
}

export const AllLog: React.FC<Props> = (props) => {
  const { [slugs.taskId]: taskId } = useParams();
  const location = useLocation();
  const parsed = parseQueryString(location.search);
  const selectedExecution = Number(parsed[RequiredQueryParams.Execution]);

  const { data, error, loading, refetch, startPolling, stopPolling } = useQuery<
    AllLogsQuery,
    AllLogsQueryVariables
  >(ALL_LOGS, {
    variables: { id: taskId, execution: selectedExecution },
    pollInterval: DEFAULT_POLL_INTERVAL,
  });
  usePolling({ startPolling, stopPolling, refetch });

  const { task } = data || {};
  const { taskLogs } = task || {};
  const { allLogs } = taskLogs || {};

  // All logs includes task, system, and agent logs. Event logs are not included.
  return useRenderBody({
    data: allLogs || [],
    loading,
    error,
    ...props,
  });
};

export const EventLog: React.FC<Props> = (props) => {
  const { [slugs.taskId]: taskId } = useParams();
  const location = useLocation();
  const parsed = parseQueryString(location.search);
  const selectedExecution = Number(parsed[RequiredQueryParams.Execution]);
  const { data, error, loading, refetch, startPolling, stopPolling } = useQuery<
    TaskEventLogsQuery,
    TaskEventLogsQueryVariables
  >(TASK_EVENT_LOGS, {
    variables: { id: taskId, execution: selectedExecution },
    pollInterval: DEFAULT_POLL_INTERVAL,
  });
  usePolling({ startPolling, stopPolling, refetch });

  const { task } = data || {};
  const { taskLogs } = task || {};
  const { eventLogs } = taskLogs || {};

  return useRenderBody({
    data: (eventLogs || []).map((v: TaskEventLogEntry) => ({
      ...v,
      kind: "taskEventLogEntry",
    })),
    loading,
    error,
    LogContainer: ({ children }) => <div>{children}</div>,
    ...props,
  });
};

export const SystemLog: React.FC<Props> = (props) => {
  const { [slugs.taskId]: taskId } = useParams();
  const location = useLocation();
  const parsed = parseQueryString(location.search);
  const selectedExecution = Number(parsed[RequiredQueryParams.Execution]);
  const { data, error, loading, refetch, startPolling, stopPolling } = useQuery<
    SystemLogsQuery,
    SystemLogsQueryVariables
  >(SYSTEM_LOGS, {
    variables: { id: taskId, execution: selectedExecution },
    pollInterval: DEFAULT_POLL_INTERVAL,
  });
  usePolling({ startPolling, stopPolling, refetch });

  const { task } = data || {};
  const { taskLogs } = task || {};
  const { systemLogs } = taskLogs || {};

  return useRenderBody({
    data: systemLogs || [],
    loading,
    error,
    ...props,
  });
};

export const AgentLog: React.FC<Props> = (props) => {
  const { [slugs.taskId]: taskId } = useParams();
  const location = useLocation();
  const parsed = parseQueryString(location.search);
  const selectedExecution = Number(parsed[RequiredQueryParams.Execution]);
  const { data, error, loading, refetch, startPolling, stopPolling } = useQuery<
    AgentLogsQuery,
    AgentLogsQueryVariables
  >(AGENT_LOGS, {
    variables: { id: taskId, execution: selectedExecution },
    pollInterval: DEFAULT_POLL_INTERVAL,
  });
  usePolling({ startPolling, stopPolling, refetch });

  const { task } = data || {};
  const { taskLogs } = task || {};
  const { agentLogs } = taskLogs || {};

  return useRenderBody({
    data: agentLogs || [],
    loading,
    error,
    ...props,
  });
};

export const TaskLog: React.FC<Props> = (props) => {
  const { [slugs.taskId]: taskId } = useParams();
  const location = useLocation();
  const parsed = parseQueryString(location.search);
  const selectedExecution = Number(parsed[RequiredQueryParams.Execution]);
  const { data, error, loading, refetch, startPolling, stopPolling } = useQuery<
    TaskLogsQuery,
    TaskLogsQueryVariables
  >(TASK_LOGS, {
    variables: { id: taskId, execution: selectedExecution },
    pollInterval: DEFAULT_POLL_INTERVAL,
  });
  usePolling({ startPolling, stopPolling, refetch });

  const { task } = data || {};
  const { taskLogs } = task || {};

  return useRenderBody({
    data: taskLogs?.taskLogs || [],
    loading,
    error,
    ...props,
  });
};

const useRenderBody: React.FC<{
  loading: boolean;
  error: ApolloError;
  data: (TaskEventLogEntryType | LogMessageType)[];
  LogContainer?: React.FC<{ children: React.ReactNode }>;
  setNoLogs: (noLogs: boolean) => void;
}> = ({
  LogContainer = ({ children }) => <StyledPre>{children}</StyledPre>,
  data,
  error,
  loading,
  setNoLogs,
}) => {
  const noLogs = error !== undefined || data.length === 0;
  // Update the value of noLogs in the parent component.
  useEffect(() => {
    setNoLogs(noLogs);
  }, [setNoLogs, noLogs]);

  if (loading) {
    return <Skeleton active title={false} paragraph={{ rows: 8 }} />;
  }
  if (noLogs) {
    return <div data-cy="cy-no-logs">No logs found</div>;
  }
  return (
    <LogContainer>
      {data.map((d, index) =>
        d.kind === "taskEventLogEntry" ? (
          <TaskEventLogLine
            key={`${d.resourceId}_${d.id}_${index}`} // eslint-disable-line react/no-array-index-key
            {...d}
          />
        ) : (
          <LogMessageLine
            key={`${d.message}_${d.timestamp}_${index}`} // eslint-disable-line react/no-array-index-key
            {...d}
          />
        ),
      )}
    </LogContainer>
  );
};

const StyledPre = styled.pre`
  border: 1px solid ${gray.light2};
  border-radius: ${size.xxs};
  font-size: ${fontSize.m};
  overflow: scroll hidden;
  padding: ${size.xs};
`;
