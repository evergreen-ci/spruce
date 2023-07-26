import { useEffect } from "react";
import { useQuery, ApolloError } from "@apollo/client";
import styled from "@emotion/styled";
import { palette } from "@leafygreen-ui/palette";
import { Skeleton } from "antd";
import { useParams, useLocation } from "react-router-dom";
import { DEFAULT_POLL_INTERVAL } from "constants/index";
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
  GET_AGENT_LOGS,
  GET_TASK_EVENT_LOGS,
  GET_SYSTEM_LOGS,
  GET_TASK_LOGS,
  GET_ALL_LOGS,
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

export const AllLog: React.VFC<Props> = (props) => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const parsed = parseQueryString(location.search);
  const selectedExecution = Number(parsed[RequiredQueryParams.Execution]);

  const { data, error, loading, refetch, startPolling, stopPolling } = useQuery<
    AllLogsQuery,
    AllLogsQueryVariables
  >(GET_ALL_LOGS, {
    pollInterval: DEFAULT_POLL_INTERVAL,
    variables: { execution: selectedExecution, id },
  });
  usePolling({ refetch, startPolling, stopPolling });

  const { task } = data || {};
  const { taskLogs } = task || {};
  const { allLogs } = taskLogs || {};

  // All logs includes task, system, and agent logs. Event logs are not included.
  return useRenderBody({
    data: allLogs || [],
    error,
    loading,
    ...props,
  });
};

export const EventLog: React.VFC<Props> = (props) => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const parsed = parseQueryString(location.search);
  const selectedExecution = Number(parsed[RequiredQueryParams.Execution]);
  const { data, error, loading, refetch, startPolling, stopPolling } = useQuery<
    TaskEventLogsQuery,
    TaskEventLogsQueryVariables
  >(GET_TASK_EVENT_LOGS, {
    pollInterval: DEFAULT_POLL_INTERVAL,
    variables: { execution: selectedExecution, id },
  });
  usePolling({ refetch, startPolling, stopPolling });

  const { task } = data || {};
  const { taskLogs } = task || {};
  const { eventLogs } = taskLogs || {};

  return useRenderBody({
    LogContainer: ({ children }) => <div>{children}</div>,
    data: (eventLogs || []).map((v: TaskEventLogEntry) => ({
      ...v,
      kind: "taskEventLogEntry",
    })),
    error,
    loading,
    ...props,
  });
};

export const SystemLog: React.VFC<Props> = (props) => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const parsed = parseQueryString(location.search);
  const selectedExecution = Number(parsed[RequiredQueryParams.Execution]);
  const { data, error, loading, refetch, startPolling, stopPolling } = useQuery<
    SystemLogsQuery,
    SystemLogsQueryVariables
  >(GET_SYSTEM_LOGS, {
    pollInterval: DEFAULT_POLL_INTERVAL,
    variables: { execution: selectedExecution, id },
  });
  usePolling({ refetch, startPolling, stopPolling });

  const { task } = data || {};
  const { taskLogs } = task || {};
  const { systemLogs } = taskLogs || {};

  return useRenderBody({
    data: systemLogs || [],
    error,
    loading,
    ...props,
  });
};

export const AgentLog: React.VFC<Props> = (props) => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const parsed = parseQueryString(location.search);
  const selectedExecution = Number(parsed[RequiredQueryParams.Execution]);
  const { data, error, loading, refetch, startPolling, stopPolling } = useQuery<
    AgentLogsQuery,
    AgentLogsQueryVariables
  >(GET_AGENT_LOGS, {
    pollInterval: DEFAULT_POLL_INTERVAL,
    variables: { execution: selectedExecution, id },
  });
  usePolling({ refetch, startPolling, stopPolling });

  const { task } = data || {};
  const { taskLogs } = task || {};
  const { agentLogs } = taskLogs || {};

  return useRenderBody({
    data: agentLogs || [],
    error,
    loading,
    ...props,
  });
};

export const TaskLog: React.VFC<Props> = (props) => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const parsed = parseQueryString(location.search);
  const selectedExecution = Number(parsed[RequiredQueryParams.Execution]);
  const { data, error, loading, refetch, startPolling, stopPolling } = useQuery<
    TaskLogsQuery,
    TaskLogsQueryVariables
  >(GET_TASK_LOGS, {
    pollInterval: DEFAULT_POLL_INTERVAL,
    variables: { execution: selectedExecution, id },
  });
  usePolling({ refetch, startPolling, stopPolling });

  const { task } = data || {};
  const { taskLogs } = task || {};

  return useRenderBody({
    data: taskLogs?.taskLogs || [],
    error,
    loading,
    ...props,
  });
};

const useRenderBody: React.VFC<{
  loading: boolean;
  error: ApolloError;
  data: (TaskEventLogEntryType | LogMessageType)[];
  LogContainer?: React.VFC<{ children: React.ReactNode }>;
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
        )
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
